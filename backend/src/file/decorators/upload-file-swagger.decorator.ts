import { applyDecorators } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { ApiFile } from '@src/file/decorators/api-file-swagger.decorator'

import { FileResponseDto } from '@src/file/dto'

export function UploadFileSwaggerDecorator() {
  return applyDecorators(
    ApiBearerAuth(),

    ApiConsumes('multipart/form-data'),
    ApiFile('img'),

    ApiOperation({ summary: 'Upload File' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiResponse({
      status: 200,
      description: 'The uploaded File info',
      type: FileResponseDto,
    }),
  )
}
