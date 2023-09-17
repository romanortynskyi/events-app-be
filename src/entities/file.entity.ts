import { Column, Entity } from 'typeorm'
import { Field, ObjectType } from '@nestjs/graphql'

import { BaseEntity } from './base.entity'
import FileProvider from '../enums/file-provider.enum'

@ObjectType()
@Entity('file')
export class FileEntity extends BaseEntity {
  @Field({ nullable: true })
  @Column({ nullable: true })
  src?: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  filename?: string

  @Field()
  @Column({ default: FileProvider.Custom })
  provider: FileProvider
}
