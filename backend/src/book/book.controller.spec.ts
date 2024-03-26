import { Test, TestingModule } from '@nestjs/testing'
import { BookController } from './book.controller'
import { BookService } from './book.service'

describe('BookController', () => {
  let controller: BookController
  let service: BookService

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        {
          provide: BookService,
          useValue: {},
        },
      ],
    }).compile()

    service = moduleRef.get<BookService>(BookService)
    controller = moduleRef.get<BookController>(BookController)
  })

  it('controller should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('service should be defined', () => {
    expect(service).toBeDefined()
  })
})
