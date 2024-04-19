import { applyDecorators } from '@nestjs/common'

import {
  ApiBearerAuth,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { TagConfirmationResponseDto } from '@src/tag/dto'

export function RemoveSwaggerDecorator() {
  return applyDecorators(
    ApiBearerAuth(),

    ApiOperation({ summary: 'Remove Tag' }),
    ApiNotFoundResponse({ description: 'Not Found' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiNotAcceptableResponse({ description: 'Not Acceptable' }),
    ApiResponse({
      status: 200,
      description: 'Tag removed',
      type: TagConfirmationResponseDto,
    }),
  )
}
