import { applyDecorators } from '@nestjs/common'

import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { BookConfirmationResponseDto } from '@src/book/dto'

export function CreateSwaggerDecorator() {
  return applyDecorators(
    ApiBearerAuth(),

    ApiOperation({ summary: 'Create Book' }),
    ApiNotFoundResponse({ description: 'Not Found' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiCreatedResponse({
      description: 'Book created',
      type: BookConfirmationResponseDto,
    }),
  )
}
