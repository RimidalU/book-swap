import { Test, TestingModule } from '@nestjs/testing'
import { FileController } from './file.controller'
import { FileService } from './file.service'

jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  randomUUID: jest.fn().mockReturnValue('3da01678-1d90-46a6-b072-70a5adc7afd5'),
}))

describe('FileController', () => {
  let controller: FileController
  let service: FileService
  const uuid = '3da01678-1d90-46a6-b072-70a5adc7afd5'
  const currentUserId = 1

  const file = {
    fieldname: 'file',
    encoding: '7bit',
    originalname: 'file.jpeg',
    mimetype: 'image/jpeg',
    path: 'something',
    buffer: Buffer.from('Buffer'),
    size: 51828,
    filename: 'file-name',
    destination: 'destination-path',
  } as Express.Multer.File

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [
        {
          provide: FileService,
          useValue: {
            convertToWebP: jest.fn().mockReturnValue(file),
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
      expect(await controller.uploadImg(currentUserId, file)).toEqual({
        file: {
          itemId: null,
          item: {
            origin: {
              name: file.filename + '.jpeg',
              url: 'url1',
              type: 'type1',
            },
            webp: {
              name: file.filename + '.webp',
              url: 'url2',
              type: 'type2',
            },
          },
        },
      })

      expect(service.convertToWebP).toHaveBeenCalledWith(file.buffer)

      expect(service.saveImg).toHaveBeenCalledWith(currentUserId, {
        origin: {
          originalname: file.originalname,
          buffer: file.buffer,
          filename: uuid + '.jpeg',
        },
        webp: {
          buffer: file,
          originalname: 'file.webp',
          filename: uuid + '.webp',
        },
      })
    })
  })
})
