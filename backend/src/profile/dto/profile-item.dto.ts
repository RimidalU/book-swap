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
    example: 'don-dou.png',
    description: 'User Avatar',
  })
  readonly avatar?: string

  @ApiProperty({
    example: false,
    description: 'Is this user in your subscriptions?',
  })
  readonly following: boolean
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
