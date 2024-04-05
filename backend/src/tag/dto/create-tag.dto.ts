import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateTagDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'adventures',
    description: 'Tag name',
  })
  readonly name: string
}
