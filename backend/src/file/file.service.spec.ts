import { Test, TestingModule } from '@nestjs/testing'
import { FileService } from './file.service'

import { fileMock } from '@src/file/mocks'
import { Repository } from 'typeorm'
import { DatabaseFileEntity } from '@src/file/entities'
import { getRepositoryToken } from '@nestjs/typeorm'
import { userItem } from '@src/user/mocks'
import { FileNotFoundException } from '@src/file/exceptions'

describe('FileService', () => {
  let service: FileService
  let databaseFileRepository: Repository<DatabaseFileEntity>
  const currentUserId = 1
  const currentFileId = 11
  const filesSet = {
    origin: fileMock,
    webp: fileMock,
  }

  const DATABASE_FILE_REPOSITORY_TOKEN = getRepositoryToken(DatabaseFileEntity)

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileService,
        {
          provide: DATABASE_FILE_REPOSITORY_TOKEN,
          useValue: {
            findOneBy: jest.fn().mockReturnValue(fileMock),
          },
        },
      ],
    }).compile()

    service = module.get(FileService)
    databaseFileRepository = module.get(DATABASE_FILE_REPOSITORY_TOKEN)
  })

  it('service should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('save-files method', () => {
    it('check returned files info with current request', async () => {
      expect(await service.saveImg(currentUserId, filesSet)).toEqual({
        origin: {
          name: fileMock.originalname,
          type: 'jpeg',
          url: 'img/file-name',
        },
        webp: {
          name: fileMock.originalname,
          type: 'jpeg',
          url: 'img/file-name',
        },
      })
    })
  })

  describe('getFileById method', () => {
    it('the user with correct id should be returned', async () => {
      expect(await service.getFileById(currentFileId)).toEqual(fileMock)

      expect(databaseFileRepository.findOneBy).toHaveBeenCalledWith({
        id: userItem.id,
      })
    })

    it('getById user with wrong id should throw an exception', async () => {
      databaseFileRepository.findOneBy = jest.fn().mockReturnValue(undefined)

      await expect(service.getFileById(currentFileId)).rejects.toThrowError(
        FileNotFoundException,
      )
    })
  })
})
