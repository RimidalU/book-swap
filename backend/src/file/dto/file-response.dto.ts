import { ApiProperty } from '@nestjs/swagger'

import { FileItemDto } from '@src/file/dto/file-item.dto'

export class FileResponseDto {
  @ApiProperty()
  file: FileItemDto
}
