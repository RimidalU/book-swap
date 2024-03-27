import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { BookEntity } from '@src/book/entities'
import { CreateBookDto } from '@src/book/dto'

import { ownerMockId } from '@src/book/mocks'

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
  ) {}
  async create(payload: CreateBookDto): Promise<number> {
    const ownerId = ownerMockId

    const newBook = new BookEntity()
    Object.assign(newBook, { ...payload, owner: ownerId })

    const book = await this.bookRepository.save(newBook)
    return book.id
  }

  async getAll(): Promise<BookEntity[]> {
    return await this.bookRepository.find()
  }
}
