import { applyDecorators } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger'

import { ApiFile } from '@src/file/decorators/api-file-swagger.decorator'

import { UserConfirmationResponseDto } from '@src/user/dto'

export function UploadFileSwaggerDecorator() {
  return applyDecorators(
    ApiBearerAuth(),

    ApiConsumes('multipart/form-data'),
    ApiFile('img'),

    ApiOperation({ summary: 'Add User Avatar' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiUnprocessableEntityResponse({ description: 'UnprocessableEntity' }),
    ApiResponse({
      status: 200,
      description: 'The uploaded File info',
      type: UserConfirmationResponseDto,
    }),
  )
}
