import { Column, Entity } from 'typeorm'
import { Field, ObjectType } from '@nestjs/graphql'

import { BaseEntity } from './base.entity'

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
  @Column({ select: false })
  password: string

  @Field()
  @Column({ nullable: true })
  recoveryCode: string

}
