import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BookService } from './book.service'

import { BookEntity } from './entities'
import { bookItem, ownerMockId } from './mocks'

describe('BookService', () => {
  let service: BookService
  let bookRepository: Repository<BookEntity>

  const BOOK_REPOSITORY_TOKEN = getRepositoryToken(BookEntity)

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: BOOK_REPOSITORY_TOKEN,
          useValue: {
            save: jest.fn().mockReturnValue(bookItem),
          },
        },
      ],
    }).compile()

    service = module.get(BookService)
    bookRepository = module.get(BOOK_REPOSITORY_TOKEN)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should bookRepository be defined', () => {
    expect(bookRepository).toBeDefined()
  })

  describe('create book method', () => {
    const createItemInfo = {
      name: bookItem.name,
      author: bookItem.author,
      condition: bookItem.condition,
      year: bookItem.year,
      description: bookItem.description,
    }

    it('check the book created', async () => {
      expect(await service.create(createItemInfo)).toBe(bookItem.id)
      expect(bookRepository.save).toHaveBeenCalledWith({
        ...createItemInfo,
        owner: ownerMockId,
      })
    })
  })
})
