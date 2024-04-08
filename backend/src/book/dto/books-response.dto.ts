import { ApiProperty } from '@nestjs/swagger'

import { ShortBookItemDto } from '@src/book/dto/short-book-item.dto'

export class BooksResponseDto {
  @ApiProperty({ isArray: true, type: ShortBookItemDto })
  readonly books: ShortBookItemDto[]

  @ApiProperty()
  readonly count: number
}
