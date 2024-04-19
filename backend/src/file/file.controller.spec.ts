import { Test, TestingModule } from '@nestjs/testing'
import { FileController } from './file.controller'
import { FileService } from './file.service'
import { fileMock } from '@src/file/mocks'

jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  randomUUID: jest.fn().mockReturnValue('3da01678-1d90-46a6-b072-70a5adc7afd5'),
}))

describe('FileController', () => {
  let controller: FileController
  let service: FileService
  const uuid = '3da01678-1d90-46a6-b072-70a5adc7afd5'
  const currentUserId = 1

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [
        {
          provide: FileService,
          useValue: {
            convertToWebP: jest.fn().mockReturnValue(fileMock),
            saveImg: jest.fn().mockReturnValue({
              origin: {
                name: uuid + '.jpeg',
                url: 'url1',
                type: 'type1',
              },
              webp: {
                name: uuid + '.webp',
                url: 'url2',
                type: 'type2',
              },
            }),
          },
        },
      ],
    }).compile()

    controller = module.get(FileController)
    service = module.get(FileService)
  })

  it('controller should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('service should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('upload-file method', () => {
    it('check returned files info with current request', async () => {
      expect(await controller.uploadImg(currentUserId, fileMock)).toEqual({
        file: {
          itemId: null,
          item: {
            origin: {
              name: fileMock.filename + '.jpeg',
              url: 'url1',
              type: 'type1',
            },
            webp: {
              name: fileMock.filename + '.webp',
              url: 'url2',
              type: 'type2',
            },
          },
        },
      })

      expect(service.convertToWebP).toHaveBeenCalledWith(fileMock.buffer)

      expect(service.saveImg).toHaveBeenCalledWith(currentUserId, {
        origin: {
          originalname: fileMock.originalname,
          buffer: fileMock.buffer,
          filename: uuid + '.jpeg',
        },
        webp: {
          buffer: fileMock,
          originalname: 'file.webp',
          filename: uuid + '.webp',
        },
      })
    })
  })
})
