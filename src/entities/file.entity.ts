import { Column, Entity } from 'typeorm'
import { Field, ObjectType } from '@nestjs/graphql'

import { BaseEntity } from './base.entity'
import FileProvider from '../enums/file-provider.enum'

@ObjectType()
@Entity('file')
export class FileEntity extends BaseEntity {
  @Field()
  @Column()
  src: string

  @Field()
  @Column({ nullable: true })
  filename: string

  @Field()
  @Column({ default: FileProvider.Custom })
  provider: FileProvider
}
