import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { BookEntity } from './entities'
import { ownerMockId } from './mocks'
import { CreateBookDto } from './dto'

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
  ) {}
  async create(payload: CreateBookDto): Promise<number> {
    const ownerId = ownerMockId
    // payload.owner = ownerId

    const newBook = new BookEntity()
    Object.assign(newBook, { ...payload, owner: ownerId })

    const book = await this.bookRepository.save(newBook)
    return book.id
  }
}
