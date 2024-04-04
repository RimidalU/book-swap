import { UserItemDto } from '@src/user/dto/user-item.dto'
import { ApiProperty } from '@nestjs/swagger'

export class BookResponseDto {
  @ApiProperty()
  book: UserItemDto
}
