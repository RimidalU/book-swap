import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { BookEntity } from './entities'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
  ) {}
}
