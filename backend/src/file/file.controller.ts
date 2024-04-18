import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { randomUUID } from 'crypto'

import { ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard'
import { FileService } from '@src/file/file.service'

import { UserInfo } from '@src/user/decorators/user-info.decorator'
import {
  FilesSetInterface,
  MulterFileBufferClass,
  UploadFileResponse,
} from '@src/file/types'
import { UploadFileSwaggerDecorator } from '@src/file/decorators'
import { FileItemDto } from '@src/file/dto/file-item.dto'
import { FileResponseDto } from '@src/file/dto'

@Controller('file')
@ApiTags('Files routes')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UploadFileSwaggerDecorator()
  @UseInterceptors(FileInterceptor('img'))
  async uploadImg(
    @UserInfo('id') currentUserId: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileResponseDto> {
    const newFileName = randomUUID()
    file.filename = newFileName

    const filesSet: FilesSetInterface = {
      origin: new MulterFileBufferClass(file),
    }

    if (file.mimetype.includes('image')) {
      const webPImg = await this.fileService.convertToWebP(file.buffer)

      filesSet.webp = {
        originalname: `${file.originalname.split('.')[0]}.webp`,
        filename: `${file.filename.split('.')[0]}.webp`,
        buffer: webPImg,
      }
    }
    const fileInfo = await this.fileService.saveImg(currentUserId, filesSet)
    return {
      file: this.buildUploadFileResponse(fileInfo),
    }
  }

  private buildUploadFileResponse(files: UploadFileResponse): FileItemDto {
    return {
      itemId: null,
      item: {
        origin: files.origin,
        webp: files?.webp,
      },
    }
  }
}
