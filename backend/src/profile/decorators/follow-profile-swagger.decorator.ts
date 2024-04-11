import { applyDecorators } from '@nestjs/common'

import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { ProfileConfirmationResponseDto } from '@src/profile/dto'

export function FollowProfileSwaggerDecorator() {
  return applyDecorators(
    ApiBearerAuth(),

    ApiOperation({ summary: 'Add Profile to following users' }),
    ApiNotFoundResponse({ description: 'Not Found' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiResponse({
      status: 200,
      description: 'Profile added to subscriptions list',
      type: ProfileConfirmationResponseDto,
    }),
  )
}
