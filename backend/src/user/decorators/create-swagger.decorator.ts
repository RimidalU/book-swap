import { applyDecorators } from '@nestjs/common'

import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { TagConfirmationResponseDto } from '@src/tag/dto'

export function CreateSwaggerDecorator() {
  return applyDecorators(
    ApiBearerAuth(),

    ApiOperation({ summary: 'Create Tag' }),
    ApiNotFoundResponse({ description: 'Not Found' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiCreatedResponse({
      description: 'Tag created',
      type: TagConfirmationResponseDto,
    }),
  )
}
