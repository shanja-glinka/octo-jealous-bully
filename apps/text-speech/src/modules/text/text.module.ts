import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationService } from '../core/pagination/pagination.service';
import { TextShortController } from './controllers/text.controller';
import { ShortText } from './entities/short-text.entity';
import { TextShortService } from './services/text-shortservice';

@Module({
  imports: [TypeOrmModule.forFeature([ShortText])],
  controllers: [TextShortController],
  providers: [TextShortService, PaginationService],
})
export class TextModule {}
