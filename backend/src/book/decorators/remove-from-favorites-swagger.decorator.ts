import { applyDecorators } from '@nestjs/common'

import {
  ApiBearerAuth,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { BookConfirmationResponseDto } from '@src/book/dto'

export function RemoveFromFavoritesSwaggerDecorator() {
  return applyDecorators(
    ApiBearerAuth(),

    ApiOperation({ summary: 'Remove Book from favorites' }),
    ApiNotFoundResponse({ description: 'Not Found' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiNotAcceptableResponse({ description: 'Not Acceptable' }),
    ApiResponse({
      status: 200,
      description: 'Book removed to favorites',
      type: BookConfirmationResponseDto,
    }),
  )
}
