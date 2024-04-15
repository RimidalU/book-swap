import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard'
import { FileService } from '@src/file/file.service'
import { UserInfo } from '@src/user/decorators/user-info.decorator'

import { UploadFileResponse } from '@src/file/types'
import {ApiFile} from "@src/file/decorators";

@Controller('file')
@ApiTags('Files routes')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('img'))
  @ApiConsumes('multipart/form-data')
  @ApiFile('img')
  async uploadFile(
    @UserInfo('id') currentUserId: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadFileResponse> {
    return this.fileService.saveFiles(currentUserId, file)
  }
}
