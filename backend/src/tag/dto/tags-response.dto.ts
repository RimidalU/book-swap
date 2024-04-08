import { ApiProperty } from '@nestjs/swagger'

import { TagItemDto } from '@src/tag/dto/tag-item.dto'

export class TagsResponseDto {
  @ApiProperty({ isArray: true, type: TagItemDto })
  readonly tags: TagItemDto[]
}
