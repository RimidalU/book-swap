import { ApiProperty } from '@nestjs/swagger'
import { TagItemDto } from '@src/tag/dto/tag-item.dto'

export class TagResponseDto {
  @ApiProperty()
  tag: TagItemDto
}
