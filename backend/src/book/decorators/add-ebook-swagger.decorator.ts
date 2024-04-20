import { applyDecorators } from '@nestjs/common'
import {
  ApiBadRequestResponse,
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
    ApiBadRequestResponse({ description: 'BookNotUpdated' }),
    ApiResponse({
      status: 200,
      description: 'The uploaded Ebook info',
      type: BookConfirmationResponseDto,
    }),
  )
}
