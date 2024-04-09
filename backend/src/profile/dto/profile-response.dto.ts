import { ApiProperty } from '@nestjs/swagger'
import { ProfileItemDto } from '@src/profile/dto/profile-item.dto'

export class ProfileResponseDto {
  @ApiProperty()
  profile: ProfileItemDto
}
