import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { unlink } from 'fs/promises';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import * as path from 'path';
import { Repository } from 'typeorm';
import { SignatureGenerator } from '../../core/generators/signature.generator';
import { PaginationService } from '../../core/pagination/pagination.service';
import { OrderDirectionType } from '../../core/types';
import { ImportFileDto } from '../dto/import-files.dto';
import { SaveSaveShortTextDto } from '../dto/save-text.dto';
import { ShortText } from '../entities/short-text.entity';

@Injectable()
export class TextShortService {
  private readonly pythonServiceUrl = `http://${process.env.TTS_SERVICE_HOST}:${process.env.TTS_SERVICE_PORT}/synthesize`;

  constructor(
    @InjectRepository(ShortText)
    private readonly shortTextRepository: Repository<ShortText>,

    private readonly paginationService: PaginationService,
  ) {}

  /**
   * The method returns a Pagination object containing the results of the query
   *
   * @param options
   * @param orderBy
   * @param orderDirection
   * @returns
   */
  public async getAll(
    options: IPaginationOptions,
    orderBy = 'createdAt',
    orderDirection: OrderDirectionType = 'DESC',
  ): Promise<Pagination<ShortText>> {
    return this.paginationService.paginate<ShortText>(
      this.shortTextRepository,
      'p',
      options,
      orderBy,
      orderDirection,
    );
  }

  /**
   * Finds and returns an entity by ID from the repository
   *
   * @param id
   * @returns
   */
  public async findOne(id: string): Promise<ShortText> {
    try {
      return await this.shortTextRepository.findOneByOrFail({
        id: id,
      });
    } catch (error) {
      throw new NotFoundException(`Entity with id ${id} not found.`);
    }
  }

  /**
   * Saves the entity. If an object ID is passed, the existing record in the
   * database is updated and the updated object is returned. If no ID is
   * passed, a new object is created and stored in the database
   *
   * @param saveEntityDto
   * @returns
   */
  public async save(
    saveEntityDto: SaveSaveShortTextDto,
    file: Express.Multer.File,
  ): Promise<ShortText> {
    const entityId = saveEntityDto?.id;
    try {
      if (saveEntityDto?.id) {
        throw new BadRequestException(
          `Leave Type with id ${entityId} cannot be updated.`,
        );
      }

      const signature = await this.generateSignature(saveEntityDto.text);

      let entity = await this.shortTextRepository.findOne({
        where: { signature },
      });

      if (entity) {
        return entity;
      }

      if (file?.path) {
        saveEntityDto.resultFileResources = [file.path];
      }

      saveEntityDto.signature = signature;

      entity = this.shortTextRepository.create(saveEntityDto);

      await this.shortTextRepository.save(entity);

      const recognition = await this.convertTextToSpeech(entity);
      if (recognition !== null) {
        entity.resultFileResources = [recognition];
        await this.shortTextRepository.save(entity);
      }

      return entity;
    } catch (ex) {
      if (file) {
        await this.deleteFiles([file]);
      }
      throw ex;
    }
  }

  /**
   * The method deletes the break entity at the specified ID
   *
   * @param id
   * @returns
   */
  public async remove(id: string) {
    await this.findOne(id);

    return this.shortTextRepository.softDelete({ id });
  }

  public async generateSignature(text: string) {
    return (await SignatureGenerator.generate(text)).hash;
  }

  public async convertTextToSpeech(entity: ShortText): Promise<string> {
    try {
      const response = await axios.post(
        this.pythonServiceUrl,
        {
          text: entity.text,
          output: entity.signature + '.wav',
          storage: path.resolve(
            `${ImportFileDto.destination}/${ImportFileDto.path}/`,
          ),
        },
        { responseType: 'json' },
      );

      return response?.data?.file_path;
    } catch (error) {
      console.error('Error converting text to speech:', error);
      throw new Error('Failed to convert text to speech');
    }
  }

  /**
   * @param files
   */
  private async deleteFiles(
    files: Array<Express.Multer.File | string>,
  ): Promise<void> {
    if (!files.length) return;

    const deletePromises = files.map((file) => {
      return unlink(typeof file === 'string' ? file : file.path);
    });

    try {
      await Promise.all(deletePromises);
    } catch (err) {}
  }
}
