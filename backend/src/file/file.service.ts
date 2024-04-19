import { Injectable } from '@nestjs/common'
import { path } from 'app-root-path'
import { ensureDir, writeFile } from 'fs-extra'
import * as sharp from 'sharp'
import { QueryRunner, Repository } from 'typeorm'

import { DatabaseFileEntity } from '@src/file/entities'

import { UploadFileResponse } from '@src/file/types'
import { FilesSetInterface } from '@src/file/types'
import { CreateDatabaseFileDto } from '@src/file/dto'
import {
  FileNotCreatedException,
  FileNotFoundException,
} from '@src/file/exceptions'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(DatabaseFileEntity)
    private readonly databaseFileRepository: Repository<DatabaseFileEntity>,
  ) {}

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

  async uploadDatabaseFile(payload: CreateDatabaseFileDto) {
    const newFile = new DatabaseFileEntity()
    Object.assign(newFile, payload)

    try {
      const file = await this.databaseFileRepository.save(newFile)
      return file
    } catch {
      throw new FileNotCreatedException(payload.name)
    }
  }

  async getFileById(id: number) {
    const file = await this.databaseFileRepository.findOneBy({ id })
    if (!file) {
      throw new FileNotFoundException({ id })
    }
    return file
  }

  async uploadDatabaseFileWithQueryRunner(
    payload: CreateDatabaseFileDto,
    queryRunner: QueryRunner,
  ) {
    const initFile = new DatabaseFileEntity()
    Object.assign(initFile, payload)

    const newFile = await queryRunner.manager.create(
      DatabaseFileEntity,
      initFile,
    )

    await queryRunner.manager.save(DatabaseFileEntity, newFile)
    return newFile
  }

  async deleteFileWithQueryRunner(id: number, queryRunner: QueryRunner) {
    const deleteResponse = await queryRunner.manager.delete(
      DatabaseFileEntity,
      { id },
    )
    if (!deleteResponse.affected) {
      throw new FileNotFoundException({ id: id })
    }
  }
}
