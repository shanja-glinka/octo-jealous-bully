import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { OrderDirectionType } from '../../core/types';
import { TextShortService } from '../services/text-shortservice';
import { SaveSaveShortTextDto } from '../dto/save-text.dto';
import { filesUploader } from '../../core/common/decorators/files-uploader.decorator';
import { ImportFileDto } from '../dto/import-files.dto';

@Controller('text/short')
@ApiTags('TextShort')
export class TextShortController {
  constructor(private readonly textShortService: TextShortService) {}

  @Get()
  async getAll(
    @Query() options: IPaginationOptions,
    @Query('orderBy') orderBy = 'createdAt',
    @Query('orderDirection') orderDirection: OrderDirectionType = 'DESC',
  ) {
    return this.textShortService.getAll(options, orderBy, orderDirection);
  }

  @Post()
  @filesUploader(ImportFileDto)
  async save(
    @Body() dto: SaveSaveShortTextDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.textShortService.save(dto, file);
  }
}
