import { ApiProperty } from '@nestjs/swagger'

class UserInfo {
  @ApiProperty({
    example: 'Don Dou',
    description: 'User Name',
  })
  readonly name: string

  @ApiProperty({
    example: 'All this happened back in...',
    description: 'Interesting stories from my life',
  })
  readonly bio?: string

  @ApiProperty({
    example: 333,
    description: 'User Avatar id',
  })
  readonly avatarId?: number
}

export class UserItemDto {
  @ApiProperty({
    example: '12',
    description: 'User id',
  })
  readonly itemId: number

  @ApiProperty()
  readonly item: UserInfo
}
