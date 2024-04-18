import { ApiProperty } from '@nestjs/swagger'
import { IsArray } from 'class-validator'

class FileInfoDto {
  @ApiProperty({
    example: 'cat.jpeg',
    description: 'File Name',
  })
  readonly name: string

  @ApiProperty({
    example: 'img/ef4c9b29-b3cc-41c3-a000-847f9b3d4e5e.jpeg',
    description: 'Url to File',
  })
  readonly url: string

  @ApiProperty({
    example: 'jpeg',
    description: 'File type',
  })
  readonly type: string
}

export class FileSetDto {
  @IsArray()
  @ApiProperty({ description: 'Origin File Info' })
  readonly origin?: FileInfoDto

  @IsArray()
  @ApiProperty({ description: 'WebP File Info' })
  readonly webp?: FileInfoDto
}

export class FileItemDto {
  @ApiProperty({
    example: '12',
    description: 'File id',
  })
  readonly itemId: number

  @IsArray()
  @ApiProperty()
  readonly item?: FileSetDto
}
