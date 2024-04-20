import { applyDecorators } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { ApiFile } from '@src/file/decorators/api-file-swagger.decorator'
import { BookConfirmationResponseDto } from '@src/book/dto'

export function AddEbookSwaggerDecorator() {
  return applyDecorators(
    ApiBearerAuth(),

    ApiConsumes('multipart/form-data'),
    ApiFile('ebook'),

    ApiOperation({ summary: 'Upload EBook' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiResponse({
      status: 200,
      description: 'The uploaded Ebook info',
      type: BookConfirmationResponseDto,
    }),
  )
}
