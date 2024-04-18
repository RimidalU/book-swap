import { Injectable } from '@nestjs/common'
import { path } from 'app-root-path'
import { ensureDir, writeFile } from 'fs-extra'
import * as sharp from 'sharp'

import { UploadFileResponse } from '@src/file/types'
import { FilesSetInterface } from '@src/file/types'

@Injectable()
export class FileService {
  async saveImg(
    currentUserId: number,
    filesSet: FilesSetInterface,
  ): Promise<UploadFileResponse> {
    const uploadFolder = `${path}/uploads/img`
    await ensureDir(uploadFolder)
    const response = {}

    for (const file in filesSet) {
      await writeFile(
        `${uploadFolder}/${filesSet[file].filename}`,
        filesSet[file].buffer,
      )
      response[file] = {
        url: `img/${filesSet[file].filename}`,
        name: filesSet[file].originalname,
        type: filesSet[file].originalname.split('.').pop(),
      }
    }
    return response
  }

  async convertToWebP(file: Buffer): Promise<Buffer> {
    return sharp(file).webp().toBuffer()
  }
}
