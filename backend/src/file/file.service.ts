import { Injectable } from '@nestjs/common'
import { path } from 'app-root-path'
import { ensureDir, writeFile } from 'fs-extra'

import { UploadFileResponse } from '@src/file/types/upload-file-response'

@Injectable()
export class FileService {
  async saveFiles(
    currentUserId: number,
    file: Express.Multer.File,
  ): Promise<UploadFileResponse> {
    const uploadFolder = `${path}/uploads/img`
    await ensureDir(uploadFolder)

    await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer)
    return {
      url: `${uploadFolder}/${file.originalname}`,
      name: file.originalname,
    }
  }
}
