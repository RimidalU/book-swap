import { ApiProperty } from '@nestjs/swagger'

import { BookItemInfoDto } from '@src/book/dto/book-item-info.dto'

export class ShortBookItemDto {
  @ApiProperty({
    example: '12',
    description: 'Book id',
  })
  readonly itemId: number

  @ApiProperty()
  readonly item: BookItemInfoDto
}
