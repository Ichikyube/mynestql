import { Prop } from '@nestjs/mongoose';
import { now } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseEntity {
  @Prop({ name: 'created_at', description: 'Created At', default: now() })
  @ApiProperty()
  insertedAt?: Date;

  @Prop({ name: 'updated_at', description: 'Updated At' })
  @ApiProperty()
  updatedAt?: Date;
}
