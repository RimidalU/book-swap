import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { randomUUID } from 'crypto'
import { Readable } from 'stream'
import { Response } from 'express'
import { createReadStream } from 'fs'
import { join } from 'path'

import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
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
import { GetDatabaseFileByIdSwaggerDecorator } from '@src/file/decorators'

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
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /.(jpg|jpeg|png|webp)$/,
        })
        .addMaxSizeValidator({
          maxSize: 6 * 1024 * 1024,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
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

  @UseGuards(JwtAuthGuard)
  @Get('avatar/:id')
  @GetDatabaseFileByIdSwaggerDecorator()
  async getDatabaseFileById(
    @UserInfo('id') currentUserId: number,
    @Res({ passthrough: true }) response: Response,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StreamableFile> {
    const file = await this.fileService.getFileById(id)

    const stream = Readable.from(file.data)

    response.set({
      'Content-Disposition': `inline; filename="${file.name}"`,
      'Content-Type': 'image',
    })

    return new StreamableFile(stream)
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get EBook by id' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiResponse({
    status: 200,
    description: 'Return EBook',
  })
  async getFileById(
    @Res({ passthrough: true }) response: Response,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StreamableFile> {
    const file = await this.fileService.getFileById(id)
    const stream = createReadStream(join(process.cwd(), file.url))
    response.set({
      'Content-Disposition': `inline; filename="${file.url}"`,
      'Content-Type': file.mimetype,
    })
    return new StreamableFile(stream)
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
