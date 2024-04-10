import { ApiProperty } from '@nestjs/swagger'

class ProfileIdDTO {
  @ApiProperty()
  itemId: number
}

export class ProfileConfirmationResponseDto {
  @ApiProperty()
  profile: ProfileIdDTO
}
