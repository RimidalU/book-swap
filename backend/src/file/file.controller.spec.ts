import { Test, TestingModule } from '@nestjs/testing'
import { FileController } from './file.controller'
import { FileService } from './file.service'

describe('FileController', () => {
  let controller: FileController
  let service: FileService
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
            saveFiles: jest.fn().mockReturnValue({
              url: `url`,
              name: 'originalname',
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
      expect(await controller.uploadFile(currentUserId, file)).toEqual({
        url: `url`,
        name: 'originalname',
      })

      expect(service.convertToWebP).toHaveBeenCalledWith(file.buffer)

      expect(service.saveFiles).toHaveBeenCalledWith(currentUserId, [
        { originalname: file.originalname, buffer: file.buffer },
        { buffer: file, originalname: 'file.webp' },
      ])
    })
  })
})
