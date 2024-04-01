import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { BookEntity } from '@src/book/entities'
import { CreateBookDto, UpdateBookDto } from '@src/book/dto'

import { BookNotFoundException } from '@src/book/exceptions'
import { UserService } from '@src/user'
import { JwtUserInfoType } from '@src/book/types'

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
    private readonly userService: UserService,
  ) {}

  async create(
    { id }: JwtUserInfoType,
    payload: CreateBookDto,
  ): Promise<number> {
    const owner = await this.userService.getById(id)

    const newBook = new BookEntity()
    Object.assign(newBook, { ...payload, owner: owner })

    const book = await this.bookRepository.save(newBook)
    return book.id
  }

  async getAll(): Promise<BookEntity[]> {
    return await this.bookRepository.find()
  }

  async getById(id: number): Promise<BookEntity> {
    const book = await this.bookRepository.findOneBy({ id })
    if (!book) {
      throw new BookNotFoundException(id)
    }
    return book
  }

  async remove(currentUser: JwtUserInfoType, id: number): Promise<number> {
    const entity = await this.getById(id)
    const book = await this.bookRepository.remove(entity)
    return book.id
  }

  async update(id: number, payload: UpdateBookDto): Promise<number> {
    const entity = await this.getById(id)
    Object.assign(entity, payload)

    await this.bookRepository.save(entity)
    return entity.id
  }
}
