import { ApiProperty } from '@nestjs/swagger'

class UserIdDTO {
  @ApiProperty()
  itemId: number
}

export class UserConfirmationResponseDto {
  @ApiProperty()
  user: UserIdDTO
}
