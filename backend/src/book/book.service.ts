import { ForbiddenException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { DataSource, Repository } from 'typeorm'

import { BookEntity } from '@src/book/entities'
import { CreateBookDto, UpdateBookDto } from '@src/book/dto'

import { BookNotFoundException } from '@src/book/exceptions'
import { QueryInterface } from '@src/book/types'
import { BooksResponseInterface } from '@src/book/types/books-response.interface'
import { UserEntity } from '@src/user/entities'

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
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

    if (query.name) {
      queryBuilder.andWhere('book.name LIKE :name', {
        name: `%${query.name}%`,
      })
    }

    if (query.author) {
      queryBuilder.andWhere('book.name LIKE :author', {
        author: `%${query.author}%`,
      })
    }

    if (query.tag) {
      queryBuilder.andWhere('book.tag LIKE :tag', {
        tags: `%${query.tag}%`,
      })
    }

    queryBuilder.limit(limit)
    queryBuilder.offset(offset)

    const books = await queryBuilder.getMany()
    const count = await queryBuilder.getCount()

    return { books, count }
  }

  async getById(id: number): Promise<BookEntity> {
    const book = await this.bookRepository.findOneBy({ id })
    if (!book) {
      throw new BookNotFoundException(id)
    }
    return book
  }

  async remove(currentUser: number, id: number): Promise<number> {
    const entity = await this.getById(id)

    if ((await this.checkPermission(currentUser, entity.owner.id)) === true) {
      const book = await this.bookRepository.remove(entity)
      return book.id
    }
  }

  async update(
    currentUser: number,
    id: number,
    payload: UpdateBookDto,
  ): Promise<number> {
    const entity = await this.getById(id)

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
}
