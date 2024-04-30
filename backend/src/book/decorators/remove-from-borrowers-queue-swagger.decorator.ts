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

export function RemoveFromBorrowersQueueSwaggerDecorator() {
  return applyDecorators(
    ApiBearerAuth(),

    ApiOperation({ summary: 'Remove User from borrowers queue' }),
    ApiNotFoundResponse({ description: 'Not Found' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiNotAcceptableResponse({ description: 'Not Acceptable' }),
    ApiResponse({
      status: 200,
      description: 'User removed from borrowers queue',
      type: BookConfirmationResponseDto,
    }),
  )
}
