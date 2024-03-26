import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BookService } from './book.service'

import { BookEntity } from './entities'

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
          useValue: {},
        },
      ],
    }).compile()

    service = module.get<BookService>(BookService)
    bookRepository = module.get<Repository<BookEntity>>(BOOK_REPOSITORY_TOKEN)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should bookRepository be defined', () => {
    expect(bookRepository).toBeDefined()
  })
})
