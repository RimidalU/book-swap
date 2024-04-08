import { ApiProperty } from '@nestjs/swagger'

class BookIdDTO {
  @ApiProperty()
  itemId: number
}

export class BookConfirmationResponseDto {
  @ApiProperty()
  book: BookIdDTO
}
