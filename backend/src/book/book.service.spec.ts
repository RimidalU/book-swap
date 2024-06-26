import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'

import { BookService } from './book.service'
import { FileService } from '@src/file/file.service'

import { BookEntity } from './entities'
import { UserEntity } from '@src/user/entities'

import { bookItem, dbFileMock, fileMock, newItemInfo } from './mocks'
import { BookNotFoundException, BookNotUpdatedException } from './exceptions'
import { userItem } from '@src/user/mocks'
import { ForbiddenException } from '@nestjs/common'
import { DatabaseFileEntity } from '@src/file/entities'

describe('BookService', () => {
  let service: BookService
  let bookRepository: Repository<BookEntity>
  let userRepository: Repository<UserEntity>
  let fileService: FileService

  const newBookInfo = {
    description: 'New description',
    year: 1990,
  }
  const currentUserId = userItem.id

  const BOOK_REPOSITORY_TOKEN = getRepositoryToken(BookEntity)
  const USER_REPOSITORY_TOKEN = getRepositoryToken(UserEntity)
  const DATABASE_FILE_REPOSITORY_TOKEN = getRepositoryToken(DatabaseFileEntity)

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
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            findOne: jest.fn().mockReturnValue(userItem),
            findOneBy: jest
              .fn()
              .mockReturnValue({ ...userItem, favorites: [] }),
            save: jest.fn().mockReturnValue(userItem.id),
          },
        },
        FileService,
        {
          provide: DATABASE_FILE_REPOSITORY_TOKEN,
          useValue: {
            save: jest.fn().mockReturnValue(dbFileMock),
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
    fileService = module.get(FileService)
    bookRepository = module.get(BOOK_REPOSITORY_TOKEN)
    userRepository = module.get(USER_REPOSITORY_TOKEN)
  })

  it('service should be defined', () => {
    expect(service).toBeDefined()
  })

  it('bookRepository should bookRepository be defined', () => {
    expect(bookRepository).toBeDefined()
  })

  it('fileService should be defined', () => {
    expect(fileService).toBeDefined()
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
        borrowerInfo: {
          avatarId: undefined,
          id: userItem.id,
          name: userItem.name,
        },
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
    it('check-permission method with currentUserId equal ownerId should be returned true', async () => {
      expect(
        await service.checkPermission(currentUserId, currentUserId),
      ).toEqual(true)
    })

    it('check-permission method with wrong currentUserId should throw an exception', async () => {
      const unCurrentUserId = currentUserId + currentUserId
      await expect(
        service.checkPermission(currentUserId, unCurrentUserId),
      ).rejects.toThrowError(ForbiddenException)
    })
  })

  describe('ad-to-favorites method', () => {
    it('addToFavorites method should be returned book id', async () => {
      const newLikes = bookItem.likes + 1
      expect(await service.addToFavorites(currentUserId, bookItem.id)).toEqual(
        bookItem.id,
      )

      expect(await bookRepository.findOneBy).toHaveBeenCalledWith({
        id: bookItem.id,
      })

      expect(bookRepository.save).toHaveBeenCalledWith({
        ...bookItem,
        likes: newLikes,
      })
    })

    it('addToFavorites with wrong book id should throw an exception', async () => {
      bookRepository.findOneBy = jest.fn().mockReturnValue(undefined)

      await expect(
        service.addToFavorites(currentUserId, bookItem.id),
      ).rejects.toThrowError(BookNotFoundException)
    })
  })

  describe('remove-from-favorites method', () => {
    it('removeFromFavorites method should be returned book id', async () => {
      const likes = 5
      const newLikes = likes - 1

      bookRepository.findOneBy = jest
        .fn()
        .mockReturnValue({ ...bookItem, likes })

      expect(
        await service.removeFromFavorites(currentUserId, bookItem.id),
      ).toEqual(bookItem.id)

      expect(await bookRepository.findOneBy).toHaveBeenCalledWith({
        id: bookItem.id,
      })

      expect(bookRepository.save).toHaveBeenCalledWith({
        ...bookItem,
        likes: newLikes,
      })
    })

    it('removeFromFavorites with wrong book id should throw an exception', async () => {
      bookRepository.findOneBy = jest.fn().mockReturnValue(undefined)

      await expect(
        service.removeFromFavorites(currentUserId, bookItem.id),
      ).rejects.toThrowError(BookNotFoundException)
    })
  })

  describe('addToBorrowersQueue method', () => {
    it('addToBorrowersQueue method should be returned book id', async () => {
      expect(
        await service.addToBorrowersQueue(currentUserId, bookItem.id),
      ).toEqual(bookItem.id)

      expect(await bookRepository.findOneBy).toHaveBeenCalledWith({
        id: bookItem.id,
      })
      expect(await userRepository.findOne).toHaveBeenCalledWith({
        where: { id: currentUserId },
        relations: ['requestedBooks'],
      })

      expect(bookRepository.save).toHaveBeenCalledWith(bookItem)
      expect(userRepository.save).toHaveBeenCalledWith(userItem)

      expect(bookItem.borrowersIdsQueue).toContain(currentUserId)
      expect(userItem.requestedBooks).toContain(bookItem)
    })

    it('addToBorrowersQueue with wrong book id should throw an exception', async () => {
      bookRepository.findOneBy = jest.fn().mockReturnValue(undefined)

      await expect(
        service.addToBorrowersQueue(currentUserId, bookItem.id),
      ).rejects.toThrowError(BookNotFoundException)
    })
  })

  describe('removeFromBorrowersQueue method', () => {
    it('removeFromBorrowersQueue method should be returned book id', async () => {
      bookRepository.findOneBy = jest.fn().mockReturnValue({ ...bookItem })

      await service.addToBorrowersQueue(currentUserId, bookItem.id)
      expect(bookItem.borrowersIdsQueue).toContain(currentUserId)
      expect(userItem.requestedBooks).toContain(bookItem)

      expect(
        await service.removeFromBorrowersQueue(currentUserId, bookItem.id),
      ).toEqual(bookItem.id)

      expect(await bookRepository.findOneBy).toHaveBeenCalledWith({
        id: bookItem.id,
      })
      expect(await userRepository.findOne).toHaveBeenCalledWith({
        where: { id: currentUserId },
        relations: ['requestedBooks'],
      })

      expect(bookRepository.save).toHaveBeenCalledWith(bookItem)
      expect(userRepository.save).toHaveBeenCalledWith(userItem)

      expect(bookItem.borrowersIdsQueue).toEqual([])
      expect(userItem.requestedBooks).toEqual([])
    })

    it('removeFromBorrowersQueue with wrong book id should throw an exception', async () => {
      bookRepository.findOneBy = jest.fn().mockReturnValue(undefined)

      await expect(
        service.removeFromBorrowersQueue(currentUserId, bookItem.id),
      ).rejects.toThrowError(BookNotFoundException)
    })
  })

  describe('addEBook method', () => {
    const eBookInfo = {
      currentUserId,
      bookId: bookItem.id,
      data: fileMock.buffer,
      originalname: fileMock.originalname,
      mimetype: fileMock.mimetype,
    }

    it('addEBook method should be returned book id', async () => {
      bookItem.owner.id = currentUserId
      bookRepository.findOneBy = jest.fn().mockReturnValue(bookItem)
      expect(await service.addEBook(eBookInfo)).toEqual(bookItem.id)

      expect(await bookRepository.findOneBy).toHaveBeenCalledWith({
        id: bookItem.id,
      })

      expect(bookRepository.save).toHaveBeenCalledWith({
        ...bookItem,
      })
    })

    it('addEBook with wrong book id should throw an exception', async () => {
      bookRepository.findOneBy = jest.fn().mockReturnValue(undefined)

      await expect(service.addEBook(eBookInfo)).rejects.toThrowError(
        BookNotFoundException,
      )
    })

    it('addEBook if the user is not the owner should throw an exception', async () => {
      bookItem.owner.id = currentUserId + 1
      bookRepository.findOneBy = jest.fn().mockReturnValue(bookItem)

      await expect(service.addEBook(eBookInfo)).rejects.toThrowError(
        BookNotUpdatedException,
      )
    })
  })

  describe('updateBorrower method', () => {
    const newBorrowerId = 111

    it('updateBorrower with  out new borrower method should be returned book id', async () => {
      bookItem.owner.id = currentUserId
      bookItem.borrower = new UserEntity()
      bookItem.borrowerId = newBorrowerId
      bookRepository.findOneBy = jest.fn().mockReturnValue(bookItem)

      expect(
        await service.updateBorrower(currentUserId, bookItem.id, null),
      ).toEqual(bookItem.id)

      expect(bookRepository.save).toHaveBeenCalledWith(bookItem)

      expect(bookItem.borrower).toBe(null)
      expect(bookItem.borrowerId).toBe(null)
    })

    it('updateBorrower with new borrower id method should be returned book id', async () => {
      expect(
        await service.updateBorrower(currentUserId, bookItem.id, newBorrowerId),
      ).toEqual(bookItem.id)

      expect(await bookRepository.findOneBy).toHaveBeenCalledWith({
        id: bookItem.id,
      })
      expect(await userRepository.findOne).toHaveBeenCalledWith({
        where: { id: newBorrowerId },
        relations: ['requestedBooks'],
      })

      expect(bookRepository.save).toHaveBeenCalledWith(bookItem)
      expect(userRepository.save).toHaveBeenCalledWith(userItem)

      expect(bookItem.borrower).toBe(userItem)
      expect(bookItem.borrowerId).toBe(userItem.id)

      expect(bookItem.borrowersIdsQueue).toEqual([])
      expect(userItem.requestedBooks).toEqual([])
    })

    it('updateBorrower with wrong book id should throw an exception', async () => {
      bookRepository.findOneBy = jest.fn().mockReturnValue(undefined)

      await expect(
        service.updateBorrower(currentUserId, bookItem.id, null),
      ).rejects.toThrowError(BookNotFoundException)
    })
  })

  it('updateBorrower if the user is not the owner  should throw an exception', async () => {
    const wrongCurrentUserId = currentUserId + 3

    await expect(
      service.updateBorrower(wrongCurrentUserId, bookItem.id, null),
    ).rejects.toThrowError(BookNotUpdatedException)
  })
})
