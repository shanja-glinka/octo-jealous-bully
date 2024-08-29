import { BaseModel } from 'apps/text-speech/src/database/base.model';
import { Column, Entity } from 'typeorm';
import { ShortTextStatus } from '../enums/short-text-status.enum';

@Entity()
export class ShortText extends BaseModel {
  @Column({ type: 'text', nullable: false, unique: true })
  signature: string;

  @Column({ type: 'text', nullable: false })
  text: string;

  @Column({ type: 'text', array: true, nullable: true })
  resultFileResources: string[];

  @Column({
    type: 'enum',
    enum: ShortTextStatus,
    default: ShortTextStatus.PENDING,
  })
  status: ShortTextStatus;
}
