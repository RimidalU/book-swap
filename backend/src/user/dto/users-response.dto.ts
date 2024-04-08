import { ApiProperty } from '@nestjs/swagger'

import { UserItemDto } from '@src/user/dto/user-item.dto'

export class UsersResponseDto {
  @ApiProperty({ isArray: true, type: UserItemDto })
  readonly users: UserItemDto[]
}
