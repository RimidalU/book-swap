import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { BookService } from './book.service'

import { BookEntity } from './entities'

import { bookItem, newItemInfo, ownerMockId } from './mocks'
import { BookNotFoundException } from './exceptions'

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
            find: jest.fn().mockReturnValue([bookItem]),
            findOneBy: jest.fn().mockReturnValue(bookItem),
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
    it('check the book created', async () => {
      expect(await service.create(newItemInfo)).toBe(bookItem.id)
      expect(bookRepository.save).toHaveBeenCalledWith({
        ...newItemInfo,
        owner: ownerMockId,
      })
    })
  })

  describe('getAll books method', () => {
    it('the array of books should be returned', async () => {
      expect(await service.getAll()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ...bookItem,
          }),
        ]),
      )

      expect(bookRepository.find).toHaveBeenCalledWith()
    })
  })

  describe('getById method', () => {
    it('the book with correct id should be returned', async () => {
      expect(await service.getById(bookItem.id)).toEqual(bookItem)

      expect(bookRepository.findOneBy).toHaveBeenCalledWith({
        id: bookItem.id,
      })
    })

    it('getById book with wrong id should throw an exception', async () => {
      bookRepository.findOneBy = jest.fn().mockReturnValue(undefined)

      await expect(service.getById(bookItem.id)).rejects.toThrowError(
        BookNotFoundException,
      )
    })
  })
})
