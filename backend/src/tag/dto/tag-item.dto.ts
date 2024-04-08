import { ApiProperty } from '@nestjs/swagger'

class TagInfo {
  @ApiProperty({
    example: 'adventures',
    description: 'Tag name',
  })
  readonly name: string
}

export class TagItemDto {
  @ApiProperty({
    example: '12',
    description: 'User id',
  })
  readonly itemId: number

  @ApiProperty()
  readonly item: TagInfo
}
