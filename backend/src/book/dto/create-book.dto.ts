import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { IsOptional } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'White Fang',
    description: 'Book name',
  })
  readonly name: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Jack London',
    description: 'Book author name',
  })
  readonly author: string

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    example: 1906,
    description: 'Year of publication of the book',
  })
  readonly year?: number

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example:
      'White Fang is a novel written in 1906 by Jack London. It is about a wolf cub named White Fang and the obstacles he faces from being owned by vicious, abusive people like Beauty Smith, and then rescued and shown kindness by his new owner Weedon Scott, who White Fang comes to love.',
    description: 'Book description',
  })
  readonly description?: string

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 6,
    description: 'Book condition(0-10)',
  })
  readonly condition: number

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiProperty({
    isArray: true,
    example: '["adventure", "wolf"]',
    description: 'Tag Names',
  })
  readonly tags?: string[]
}
