import { applyDecorators } from '@nestjs/common'

import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { ProfileConfirmationResponseDto } from '@src/profile/dto'

export function UnfollowProfileSwaggerDecorator() {
  return applyDecorators(
    ApiBearerAuth(),

    ApiOperation({ summary: 'Remove Profile from subscriptions users' }),
    ApiNotFoundResponse({ description: 'Not Found' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiResponse({
      status: 200,
      description: 'Profile removed from subscriptions list',
      type: ProfileConfirmationResponseDto,
    }),
  )
}
