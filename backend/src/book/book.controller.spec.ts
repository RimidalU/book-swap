import { Test, TestingModule } from '@nestjs/testing'

import { BookController } from './book.controller'
import { BookService } from './book.service'

import { bookItem, newItemInfo } from './mocks'

describe('BookController', () => {
  let controller: BookController
  let service: BookService

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        {
          provide: BookService,
          useValue: {
            create: jest.fn().mockReturnValue(bookItem.id),
          },
        },
      ],
    }).compile()

    service = moduleRef.get(BookService)
    controller = moduleRef.get(BookController)
  })

  it('controller should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('service should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create book method', () => {
    it('check the book created', async () => {
      expect(await controller.create(newItemInfo)).toBe(bookItem.id)

      expect(service.create).toHaveBeenCalledWith({
        ...newItemInfo,
      })
    })
  })
})
