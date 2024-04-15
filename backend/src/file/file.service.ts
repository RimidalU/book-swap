import { Injectable } from '@nestjs/common'
import { path } from 'app-root-path'
import { ensureDir, writeFile } from 'fs-extra'
import * as sharp from 'sharp'

import { UploadFileResponse } from '@src/file/types/upload-file-response'
import {MulterFileBufferClass} from "@src/file/types";

@Injectable()
export class FileService {
  async saveFiles(
    currentUserId: number,
    files: MulterFileBufferClass [],
  ): Promise<UploadFileResponse[]> {
    const uploadFolder = `${path}/uploads/img`
    await ensureDir(uploadFolder)
const response: UploadFileResponse[] =[]

    for(const file of files){
      await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer)
      response.push({
        url: `${uploadFolder}/${file.originalname}`,
        name: file.originalname
      })
    }
    return response
  }

  async convertToWebP(file: Buffer): Promise<Buffer>{
return sharp(file)
  .webp()
  .toBuffer()
  }
}
