import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'

import { BookService } from './book.service'

import { BookEntity } from './entities'
import { UserEntity } from '@src/user/entities'

import { bookItem, newItemInfo } from './mocks'
import { BookNotFoundException } from './exceptions'
import { userItem } from '@src/user/mocks'
import { ForbiddenException } from '@nestjs/common'

describe('BookService', () => {
  let service: BookService

  let bookRepository: Repository<BookEntity>
  const newBookInfo = {
    description: 'New description',
    year: 1990,
  }
  const currentUserId = userItem.id

  const BOOK_REPOSITORY_TOKEN = getRepositoryToken(BookEntity)
  const USER_REPOSITORY_TOKEN = getRepositoryToken(UserEntity)

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
            remove: jest.fn().mockReturnValue(bookItem),
          },
        },
        // UserService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            findOne: jest.fn().mockReturnValue(userItem),
            findOneBy: jest
              .fn()
              .mockReturnValue({ ...userItem, favorites: [] }),
          },
        },
        {
          provide: DataSource,
          useValue: {
            getRepository: jest.fn().mockImplementation(() => ({
              createQueryBuilder: jest.fn().mockImplementation(() => ({
                leftJoinAndSelect: jest.fn().mockImplementation(() => ({
                  orderBy: jest.fn().mockReturnValue([bookItem]),
                  limit: jest.fn().mockReturnValue([bookItem]),
                  offset: jest.fn().mockReturnValue([bookItem]),
                  getCount: jest.fn().mockReturnValue(0),

                  getMany: jest.fn().mockReturnValue([bookItem]),
                })),
              })),
            })),
          },
        },
      ],
    }).compile()

    service = module.get(BookService)
    bookRepository = module.get(BOOK_REPOSITORY_TOKEN)
  })

  it('service should be defined', () => {
    expect(service).toBeDefined()
  })

  it('bookRepository should bookRepository be defined', () => {
    expect(bookRepository).toBeDefined()
  })

  describe('create book method', () => {
    it('check the book created', async () => {
      expect(await service.create(currentUserId, newItemInfo)).toBe(bookItem.id)
      expect(bookRepository.save).toHaveBeenCalledWith({
        ...newItemInfo,
        owner: userItem,
      })
    })
  })

  describe('getAll books method', () => {
    it('the array of books should be returned', async () => {
      expect(await service.getAll(currentUserId, {})).toEqual({
        books: [{ ...bookItem, inFavorites: false }],
        count: 0,
      })
    })
  })

  describe('getById method', () => {
    it('the book with correct id should be returned', async () => {
      expect(await service.getById(currentUserId, bookItem.id)).toEqual({
        ...bookItem,
        inFavorites: false,
      })

      expect(bookRepository.findOneBy).toHaveBeenCalledWith({
        id: bookItem.id,
      })
    })

    it('getById book with wrong id should throw an exception', async () => {
      bookRepository.findOneBy = jest.fn().mockReturnValue(undefined)

      await expect(
        service.getById(currentUserId, bookItem.id),
      ).rejects.toThrowError(BookNotFoundException)
    })
  })

  describe('remove method', () => {
    it('remove the book with correct id should be returned book id', async () => {
      service.checkPermission = jest.fn().mockReturnValue(true)

      expect(await service.remove(currentUserId, bookItem.id)).toEqual(
        bookItem.id,
      )

      expect(await bookRepository.findOneBy).toHaveBeenCalledWith({
        id: bookItem.id,
      })
      expect(bookRepository.remove).toHaveBeenCalledWith(bookItem)
    })

    it('remove book with wrong id should throw an exception', async () => {
      bookRepository.findOneBy = jest.fn().mockReturnValue(undefined)

      await expect(
        service.remove(currentUserId, bookItem.id),
      ).rejects.toThrowError(BookNotFoundException)
    })
  })

  describe('update method', () => {
    it('update the book with correct id should be returned book id', async () => {
      service.checkPermission = jest.fn().mockReturnValue(true)

      expect(
        await service.update(currentUserId, bookItem.id, newBookInfo),
      ).toEqual(bookItem.id)

      expect(await bookRepository.findOneBy).toHaveBeenCalledWith({
        id: bookItem.id,
      })

      expect(bookRepository.save).toHaveBeenCalledWith({
        ...bookItem,
        ...newBookInfo,
      })
    })

    it('update book with wrong id should throw an exception', async () => {
      bookRepository.findOneBy = jest.fn().mockReturnValue(undefined)

      await expect(
        service.update(currentUserId, bookItem.id, newBookInfo),
      ).rejects.toThrowError(BookNotFoundException)
    })
  })

  describe('check-permission method', () => {
    it('check-permission with currentUserId equal ownerId should be returned true', async () => {
      expect(
        await service.checkPermission(currentUserId, currentUserId),
      ).toEqual(true)
    })

    it('check-permission with wrong currentUserId should throw an exception', async () => {
      const unCurrentUserId = currentUserId + currentUserId
      await expect(
        service.checkPermission(currentUserId, unCurrentUserId),
      ).rejects.toThrowError(ForbiddenException)
    })
  })
})
