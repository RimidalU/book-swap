import { ApiProperty } from '@nestjs/swagger'

import { BookItemInfoDto } from '@src/book/dto/book-item-info.dto'
import { BookItemStatusDto } from '@src/book/dto/book-item-status.dto'

export class BookItemDto {
  @ApiProperty({
    example: '12',
    description: 'Book id',
  })
  readonly itemId: number

  @ApiProperty()
  readonly item: BookItemInfoDto

  @ApiProperty()
  readonly itemStatus: BookItemStatusDto
}
