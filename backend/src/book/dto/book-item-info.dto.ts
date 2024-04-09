import { ApiProperty } from '@nestjs/swagger'

export class BookItemInfoDto {
  @ApiProperty({
    example: 'White Fang',
    description: 'Book name',
  })
  readonly name: string

  @ApiProperty({
    example: 'Jack London',
    description: 'Book author name',
  })
  readonly author: string

  @ApiProperty({
    example: 1906,
    description: 'Year of publication of the book',
  })
  readonly year: number

  @ApiProperty({
    example:
      'White Fang is a novel written in 1906 by Jack London. It is about a wolf cub named White Fang and the obstacles he faces from being owned by vicious, abusive people like Beauty Smith, and then rescued and shown kindness by his new owner Weedon Scott, who White Fang comes to love.',
    description: 'Book description',
  })
  readonly description: string

  @ApiProperty({
    example: '["adventure", "wolf"]',
    description: 'Tag Names',
  })
  readonly tags: string[]

  @ApiProperty({
    example: 6,
    description: 'Book condition(0-10)',
  })
  readonly condition: number

  @ApiProperty({
    example: 23,
    description: 'Likes count',
  })
  readonly likes: number

  @ApiProperty({
    example: 235,
    description: 'Book owner id',
  })
  readonly ownerId: number

  @ApiProperty({
    example: 'jack.png',
    description: 'Book owner avatar',
  })
  readonly ownerAvatar: string

  @ApiProperty({
    example: true,
    description: "The book is in this user's favorites",
  })
  readonly inFavorites: boolean
}
