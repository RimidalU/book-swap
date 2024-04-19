import { ApiProperty } from '@nestjs/swagger'

class ProfileInfo {
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

  @ApiProperty({
    example: false,
    description: 'Is this user in your subscriptions?',
  })
  readonly inSubscriptions: boolean
}

export class ProfileItemDto {
  @ApiProperty({
    example: '12',
    description: 'Profile id',
  })
  readonly itemId: number

  @ApiProperty()
  readonly item: ProfileInfo
}
