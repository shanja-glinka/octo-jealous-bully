import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { PaginationService } from '../../core/pagination/pagination.service';
import { OrderDirectionType } from '../../core/types';
import { SaveSaveShortTextDto } from '../dto/save-text.dto';
import { ShortText } from '../entities/short-text.entity';
import { unlink } from 'fs/promises';
import { SignatureGenerator } from '../../core/generators/signature.generator';

@Injectable()
export class TextShortService {
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
