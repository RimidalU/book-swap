import { ApiProperty } from '@nestjs/swagger'

class TagIdDTO {
  @ApiProperty()
  itemId: number
}

export class TagConfirmationResponseDto {
  @ApiProperty()
  tag: TagIdDTO
}
