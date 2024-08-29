import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { transformToNullIfUndefined } from '../../core/common/decorators/transaform-to-null';
import { BaseDto } from '../../core/common/dto/base-dto';

export class SaveSaveShortTextDto extends BaseDto {
  @ApiPropertyOptional({ example: '497f6eca-6276-4993-bfeb-53cbbbba6f08' })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty({ example: 'Monthly Accrual Rule' })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({ example: true, default: true })
  @transformToNullIfUndefined()
  @IsBoolean()
  @IsOptional()
  resultFileResources?: string[] | null;

  @Exclude()
  signature?: string;
}
