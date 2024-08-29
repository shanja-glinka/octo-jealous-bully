import { Exclude } from 'class-transformer';

export class BaseDto {
  @Exclude()
  createdAt?: Date;
  @Exclude()
  updatedAt?: Date;
  @Exclude()
  deletedAt?: Date;

  @Exclude()
  createdBy?: string;
  @Exclude()
  updatedBy?: string;
  @Exclude()
  deletedBy?: string;
}
