import { applyDecorators } from '@nestjs/common'

import {
  ApiBearerAuth,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { UserConfirmationResponseDto } from '@src/user/dto'

export function UpdateSwaggerDecorator() {
  return applyDecorators(
    ApiBearerAuth(),

    ApiOperation({ summary: 'Update User by id' }),
    ApiNotFoundResponse({ description: 'Not Found' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiNotAcceptableResponse({ description: 'Not Acceptable' }),
    ApiOkResponse({
      description: 'User Updated',
      type: UserConfirmationResponseDto,
    }),
  )
}
