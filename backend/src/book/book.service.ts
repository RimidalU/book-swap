import { ForbiddenException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { DataSource, Repository } from 'typeorm'

import { BookEntity } from '@src/book/entities'
import { CreateBookDto, UpdateBookDto } from '@src/book/dto'

import {
  BookNotFoundException,
  BookNotUpdatedException,
} from '@src/book/exceptions'
import {
  BookEntityWithBorrowerInterface,
  QueryInterface,
} from '@src/book/types'
import { BooksResponseInterface } from '@src/book/types/books-response.interface'
import { UserEntity } from '@src/user/entities'
import { UserNotFoundException } from '@src/user/exceptions'
import { FileService } from '@src/file/file.service'

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly fileService: FileService,
    private readonly dataSource: DataSource,
  ) {}

  async create(currentUserId: number, payload: CreateBookDto): Promise<number> {
    const owner = await this.userRepository.findOneBy({ id: currentUserId })

    const newBook = new BookEntity()
    Object.assign(newBook, { ...payload, owner: owner })

    const book = await this.bookRepository.save(newBook)
    return book.id
  }

  async getAll(
    currentUserId: number,
    query: QueryInterface,
  ): Promise<BooksResponseInterface> {
    const { limit = 20, offset = 0 } = query
    let favoritesUserBookIds: number[] = []

    const queryBuilder = await this.dataSource
      .getRepository(BookEntity)
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.owner', 'books')

    queryBuilder.orderBy('book.createdAt', 'DESC')

    if (query.owner) {
      const owner = await this.userRepository.findOneBy({
        name: query.owner,
      })
      if (owner) {
        queryBuilder.andWhere('book.owner = :id', {
          id: owner.id,
        })
      }
    }

    if (query.selectedUser) {
      const user = await this.userRepository.findOne({
        where: { name: query.selectedUser },
        relations: {
          favorites: true,
        },
      })
      if (user) {
        favoritesUserBookIds = user.favorites.map((book) => book.id)

        if (favoritesUserBookIds.length > 0) {
          queryBuilder.andWhere('book.owner IN (:...favoritesUserBookIds)', {
            favoritesUserBookIds,
          })
        } else {
          queryBuilder.andWhere('1=0')
        }
      }
    }

    if (query.name) {
      queryBuilder.andWhere('book.name LIKE :name', {
        name: `%${query.name}%`,
      })
    }

    if (query.author) {
      queryBuilder.andWhere('book.author LIKE :author', {
        author: `%${query.author}%`,
      })
    }

    if (query.tag) {
      queryBuilder.andWhere('book.tags LIKE :tag', {
        tag: `%${query.tag}%`,
      })
    }

    if (currentUserId) {
      const user = await this.userRepository.findOne({
        where: { id: currentUserId },
        relations: {
          favorites: true,
        },
      })
      favoritesUserBookIds = user.favorites.map((book) => book.id)
    }

    queryBuilder.limit(limit)
    queryBuilder.offset(offset)

    const books = await queryBuilder.getMany()
    const count = await queryBuilder.getCount()

    const favoritesBook = books.map((book) => {
      const inFavorites = favoritesUserBookIds.includes(book.id)

      return { ...book, inFavorites }
    })

    return { books: favoritesBook, count }
  }

  async getOne(id: number): Promise<BookEntity> {
    const book = await this.bookRepository.findOneBy({ id })
    if (!book) {
      throw new BookNotFoundException(id)
    }
    return book
  }

  async getById(
    currentUserId: number,
    id: number,
  ): Promise<BookEntityWithBorrowerInterface> {
    const book = await this.bookRepository.findOneBy({ id })
    let borrowerInfo = null
    if (!book) {
      throw new BookNotFoundException(id)
    }

    let inFavorites = false

    if (currentUserId) {
      const user = await this.userRepository.findOne({
        where: { id: currentUserId },
        relations: ['favorites'],
      })
      const favoritesUserBookIds = user.favorites.map((book) => book.id)

      const borrower = await this.userRepository.findOne({
        where: { id: book.borrowerId },
      })

      borrowerInfo = {
        id: borrower.id,
        name: borrower.name,
        avatarId: borrower.avatarId,
      }

      inFavorites = favoritesUserBookIds.includes(book.id)
    }

    const newBook = { ...book, inFavorites, borrowerInfo }
    return newBook
  }

  async remove(currentUser: number, id: number): Promise<number> {
    const entity = await this.getOne(id)

    if ((await this.checkPermission(currentUser, entity.owner.id)) === true) {
      await this.bookRepository.remove(entity)
      return id
    }
  }

  async update(
    currentUser: number,
    id: number,
    payload: UpdateBookDto,
  ): Promise<number> {
    const entity = await this.getOne(id)

    if (await this.checkPermission(currentUser, entity.owner.id)) {
      Object.assign(entity, payload)

      await this.bookRepository.save(entity)
      return entity.id
    }
  }

  async checkPermission(currentUserId, ownerId): Promise<boolean> {
    if (currentUserId === ownerId) {
      return true
    }
    throw new ForbiddenException()
  }

  async addToFavorites(currentUserId: number, bookId: number): Promise<number> {
    const book = await this.getOne(bookId)
    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['favorites'],
    })
    const isNotFavorite =
      user.favorites.findIndex(
        (bookInFavorites) => bookInFavorites.id === book.id,
      ) === -1

    if (isNotFavorite) {
      user.favorites.push(book)
      book.likes += 1

      await this.bookRepository.save(book)
      await this.userRepository.save(user)

      return bookId
    }
    return bookId
  }

  async removeFromFavorites(
    currentUserId: number,
    bookId: number,
  ): Promise<number> {
    const book = await this.getOne(bookId)
    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['favorites'],
    })
    const bookIndex = user.favorites.findIndex(
      (bookInFavorites) => bookInFavorites.id === book.id,
    )

    if (bookIndex >= 0) {
      user.favorites.splice(bookIndex, 1)
      book.likes -= 1

      await this.bookRepository.save(book)
      await this.userRepository.save(user)

      return bookId
    }
    return bookId
  }

  async myFeed(
    currentUserId: number,
    query: QueryInterface,
  ): Promise<BooksResponseInterface> {
    const { limit = 20, offset = 0 } = query

    const currentUser = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['subscriptions', 'favorites'],
    })

    if (!currentUser) {
      throw new UserNotFoundException({ currentUserId })
    }

    const subscriptionsUserIds = currentUser.subscriptions.map(
      (user) => user.id,
    )

    if (subscriptionsUserIds.length === 0) {
      return { books: [], count: 0 }
    }

    const favoritesUserBookIds = currentUser.favorites.map((book) => book.id)

    const queryBuilder = await this.dataSource
      .getRepository(BookEntity)
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.owner', 'books')

    queryBuilder.where('book.ownerId IN (:...ids)', {
      ids: subscriptionsUserIds,
    })

    queryBuilder.orderBy('book.createdAt', 'DESC')

    queryBuilder.limit(limit)
    queryBuilder.offset(offset)

    const books = await queryBuilder.getMany()
    const count = await queryBuilder.getCount()

    const favoritesBook = books.map((book) => {
      const inFavorites = favoritesUserBookIds.includes(book.id)

      return { ...book, inFavorites }
    })

    return { books: favoritesBook, count }
  }

  async addEBook(payload: {
    currentUserId: number
    bookId: number
    data: Buffer
    originalname: string
    mimetype: string
  }): Promise<number> {
    const book = await this.getOne(payload.bookId)

    if (book.owner.id !== payload.currentUserId) {
      throw new BookNotUpdatedException(payload.bookId)
    }
    const ebook = await this.fileService.uploadFile({
      data: payload.data,
      name: payload.originalname,
      mimetype: payload.mimetype,
    })

    book.ebookId = ebook.id

    const newBook = await this.bookRepository.save(book)

    return newBook.id
  }

  async addToBorrowersQueue(
    currentUserId: number,
    bookId: number,
  ): Promise<number> {
    const book = await this.getOne(bookId)
    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['requestedBooks'],
    })

    const isNotInBorrowersQueue =
      book.borrowersIdsQueue.findIndex(
        (userInQueue) => userInQueue === user.id,
      ) === -1

    if (isNotInBorrowersQueue) {
      book.borrowersIdsQueue.push(user.id)
      user.requestedBooks.push(book)

      await this.bookRepository.save(book)
      await this.userRepository.save(user)

      return bookId
    }
    return bookId
  }

  async removeFromBorrowersQueue(
    currentUserId: number,
    bookId: number,
  ): Promise<number> {
    const book = await this.getOne(bookId)
    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['requestedBooks'],
    })

    const inBorrowersQueueIndex = book.borrowersIdsQueue.findIndex(
      (userInQueue) => userInQueue === user.id,
    )

    const inRequestedBooksIndex = user.requestedBooks.findIndex(
      (requestedBook) => requestedBook.id === book.id,
    )

    if (inBorrowersQueueIndex !== -1) {
      book.borrowersIdsQueue.splice(inBorrowersQueueIndex, 1)
      await this.bookRepository.save(book)
    }

    if (inRequestedBooksIndex !== -1) {
      user.requestedBooks.splice(inRequestedBooksIndex, 1)
      await this.userRepository.save(user)
    }
    return bookId
  }
}
