import { Field, InputType } from '@nestjs/graphql'
import { IsNumber } from 'class-validator'

@InputType()
class GetEventsBounds {
  @Field(() => Number)
  @IsNumber()
  xMin: number

  @Field(() => Number)
  @IsNumber()
  yMin: number

  @Field(() => Number)
  @IsNumber()
  xMax: number

  @Field(() => Number)
  @IsNumber()
  yMax: number
}

export default GetEventsBounds
