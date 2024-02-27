import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
class Highlight {
  @Field()
  text: string

  @Field()
  isMatch: boolean
}

export default Highlight
