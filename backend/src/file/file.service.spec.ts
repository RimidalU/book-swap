import { Test, TestingModule } from '@nestjs/testing'
import { FileService } from './file.service'

import {fileMock} from "@src/file/mocks";

describe('FileService', () => {
  let service: FileService
  const currentUserId = 1
  const filesSet = {
    origin: fileMock,
    webp: fileMock,
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileService],
    }).compile()

    service = module.get(FileService)
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
})
