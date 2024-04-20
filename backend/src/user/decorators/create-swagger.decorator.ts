import { applyDecorators } from '@nestjs/common'

import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger'

import { UserConfirmationResponseDto } from '@src/user/dto'

export function CreateSwaggerDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Create User' }),
    ApiNotFoundResponse({ description: 'Not Found' }),
    ApiCreatedResponse({
      description: 'User created',
      type: UserConfirmationResponseDto,
    }),
  )
}
