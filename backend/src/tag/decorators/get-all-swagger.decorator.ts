import { applyDecorators } from '@nestjs/common'

import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { TagsResponseDto } from '@src/tag/dto'

export function CreateSwaggerDecorator() {
  return applyDecorators(
    ApiBearerAuth(),

    ApiOperation({ summary: 'Get all Tags' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiResponse({
      status: 200,
      description: 'The found records',
      type: TagsResponseDto,
    }),
    ApiQuery({ name: 'name', required: false, description: 'Tag name' }),
  )
}
