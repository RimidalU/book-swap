import { applyDecorators } from '@nestjs/common'

import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

import { BooksResponseDto } from '@src/book/dto'

export function GetAllSwaggerDecorator() {
  return applyDecorators(
    ApiBearerAuth(),

    ApiOperation({ summary: 'Get All Books' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiResponse({
      status: 200,
      description: 'The found records',
      type: BooksResponseDto,
    }),

    ApiQuery({ name: 'limit', required: false, description: 'Items on page' }),
    ApiQuery({
      name: 'offset',
      required: false,
      description: 'Offset on page',
    }),
    ApiQuery({
      name: 'owner',
      required: false,
      description: 'Owner name(complete match)',
    }),
    ApiQuery({ name: 'name', required: false, description: 'Book name' }),
    ApiQuery({ name: 'author', required: false, description: 'Author name' }),
    ApiQuery({ name: 'tag', required: false, description: 'Tags' }),
    ApiQuery({
      name: 'selectedUser',
      required: false,
      description: "Books in this user's favorites",
    }),
  )
}
