import { Test, TestingModule } from '@nestjs/testing'
import { FileService } from './file.service'

describe('FileService', () => {
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
      providers: [FileService],
    }).compile()

    service = module.get(FileService)
  })

  it('service should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('save-files method', () => {
    it('check returned files info with current request', async () => {
      expect(
        await service.saveFiles(currentUserId, [
          {
            originalname: file.originalname,
            buffer: file.buffer,
          },
        ]),
      ).toEqual([
        {
          name: file.originalname,
          url: `img/${file.originalname}`,
        },
      ])
    })
  })
})
