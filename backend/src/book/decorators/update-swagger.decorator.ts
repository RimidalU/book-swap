import { applyDecorators } from '@nestjs/common'

import {
  ApiBearerAuth,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { BookConfirmationResponseDto } from '@src/book/dto'

export function UpdateSwaggerDecorator() {
  return applyDecorators(
    ApiBearerAuth(),

    ApiOperation({ summary: 'Update Book by id' }),
    ApiNotFoundResponse({ description: 'Not Found' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiNotAcceptableResponse({ description: 'Not Acceptable' }),
    ApiOkResponse({
      description: 'Book Updated',
      type: BookConfirmationResponseDto,
    }),
  )
}
