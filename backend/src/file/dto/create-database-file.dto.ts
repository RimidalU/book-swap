import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateDatabaseFileDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Don Dou avatar',
    description: 'User avatar name',
  })
  readonly name: string

  @IsNotEmpty()
  @ApiProperty({
    example: 'Don Dou avatar',
    description: 'User avatar name',
  })
  readonly data: Uint8Array
}
