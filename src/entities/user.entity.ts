import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
} from 'typeorm'
import { Field, ObjectType } from '@nestjs/graphql'

import { BaseEntity } from './base.entity'
import { FileEntity } from './file.entity'

@ObjectType()
@Entity('user')
export class UserEntity extends BaseEntity {
  @Field()
  @Column()
  firstName: string

  @Field()
  @Column()
  lastName: string

  @Field()
  @Column({ unique: true })
  email: string

  @Field()
  @Column({ select: false, nullable: true })
  password: string

  @Field()
  @Column({ nullable: true })
  recoveryCode: string

  @Field(() => FileEntity)
  @OneToOne(() => FileEntity, { nullable: true })
  @JoinColumn()
  image: FileEntity
}
