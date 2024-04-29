import { Test, TestingModule } from '@nestjs/testing'

import { BookController } from './book.controller'
import { BookService } from './book.service'

import { bookItem, fileMock, newItemInfo } from './mocks'
import { userItem } from '@src/user/mocks'

describe('BookController', () => {
  let controller: BookController
  let service: BookService
  const currentUserId = userItem.id
  const newBookInfo = {
    description: 'New description',
    year: 1990,
  }

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        {
          provide: BookService,
          useValue: {
            create: jest.fn().mockReturnValue(bookItem.id),
            getAll: jest.fn().mockReturnValue({ books: [bookItem], count: 1 }),
            getById: jest.fn().mockReturnValue(bookItem),
            remove: jest.fn().mockReturnValue(bookItem.id),
            update: jest.fn().mockReturnValue(bookItem.id),
            addToFavorites: jest.fn().mockReturnValue(bookItem.id),
            removeFromFavorites: jest.fn().mockReturnValue(bookItem.id),
            addEBook: jest.fn().mockReturnValue(bookItem.id),
            addToBorrowersQueue: jest.fn().mockReturnValue(bookItem.id),
            removeFromBorrowersQueue: jest.fn().mockReturnValue(bookItem.id),
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
      expect(await controller.create(currentUserId, newItemInfo)).toEqual({
        book: { itemId: bookItem.id },
      })

      expect(service.create).toHaveBeenCalledWith(currentUserId, {
        ...newItemInfo,
      })
    })
  })

  describe('get all books method', () => {
    it('check returned array of books', async () => {
      expect(await controller.getAll(currentUserId, {})).toEqual({
        books: [
          {
            itemId: bookItem.id,
            item: {
              ...newItemInfo,
              ebookId: undefined,
              inFavorites: undefined,
              likes: 0,
              ownerAvatar: undefined,
              ownerId: undefined,
              tags: bookItem.tags,
            },
          },
        ],
        count: 1,
      })

      expect(service.getAll).toHaveBeenCalledWith(currentUserId, {})
    })
  })

  describe('getById book method', () => {
    it('check returned books with current id', async () => {
      expect(await controller.getById(currentUserId, bookItem.id)).toEqual({
        book: {
          itemId: bookItem.id,
          itemStatus: {
            borrower: {
              avatarId: undefined,
              id: undefined,
              name: undefined,
            },
            borrowersIdsQueue: [],
            isBorrowed: false,
          },
          item: {
            ...newItemInfo,
            ownerAvatar: undefined,
            ownerId: undefined,
            ebookId: undefined,
            inFavorites: undefined,
            likes: 0,
            tags: bookItem.tags,
          },
        },
      })

      expect(service.getById).toHaveBeenCalledWith(bookItem.id, currentUserId)
    })
  })

  describe('remove book method', () => {
    it('check returned book id', async () => {
      expect(await controller.remove(currentUserId, bookItem.id)).toEqual({
        book: { itemId: bookItem.id },
      })

      expect(service.remove).toHaveBeenCalledWith(currentUserId, bookItem.id)
    })
  })

  describe('update book method', () => {
    it('check returned updated book with current id', async () => {
      expect(
        await controller.update(currentUserId, bookItem.id, newBookInfo),
      ).toEqual({
        book: { itemId: bookItem.id },
      })

      expect(service.update).toHaveBeenCalledWith(
        currentUserId,
        bookItem.id,
        newBookInfo,
      )
    })
  })

  describe('add to favorites book method', () => {
    it('check returned book id', async () => {
      expect(
        await controller.addToFavorites(currentUserId, bookItem.id),
      ).toEqual({
        book: { itemId: bookItem.id },
      })

      expect(service.addToFavorites).toHaveBeenCalledWith(
        currentUserId,
        bookItem.id,
      )
    })
  })

  describe('remove from favorites book method', () => {
    it('check returned book id', async () => {
      expect(
        await controller.removeFromFavorites(currentUserId, bookItem.id),
      ).toEqual({
        book: { itemId: bookItem.id },
      })

      expect(service.removeFromFavorites).toHaveBeenCalledWith(
        currentUserId,
        bookItem.id,
      )
    })
  })

  describe('add add E-book method', () => {
    it('check returned book id', async () => {
      expect(
        await controller.addEBook(currentUserId, bookItem.id, fileMock),
      ).toEqual({
        book: { itemId: bookItem.id },
      })

      expect(service.addEBook).toHaveBeenCalledWith({
        bookId: bookItem.id,
        currentUserId,
        data: fileMock.buffer,
        originalname: fileMock.originalname,
        mimetype: fileMock.mimetype,
      })
    })
  })

  describe('add user to borrowers queue method', () => {
    it('check returned book id', async () => {
      expect(
        await controller.addToBorrowersQueue(currentUserId, bookItem.id),
      ).toEqual({
        book: { itemId: bookItem.id },
      })

      expect(service.addToBorrowersQueue).toHaveBeenCalledWith(
        currentUserId,
        bookItem.id,
      )
    })
  })

  describe('remove user from borrowers queue method', () => {
    it('check returned book id', async () => {
      expect(
        await controller.removeFromBorrowersQueue(currentUserId, bookItem.id),
      ).toEqual({
        book: { itemId: bookItem.id },
      })

      expect(service.removeFromBorrowersQueue).toHaveBeenCalledWith(
        currentUserId,
        bookItem.id,
      )
    })
  })
})
