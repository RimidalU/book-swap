import { applyDecorators } from '@nestjs/common'

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { UsersResponseDto } from '@src/user/dto'

export function GetAllSwaggerDecorator() {
  return applyDecorators(
    ApiBearerAuth(),

    ApiOperation({ summary: 'Get All Users' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiResponse({
      status: 200,
      description: 'The found records',
      type: UsersResponseDto,
    }),
  )
}
