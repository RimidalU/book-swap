import { Body, Controller, Get, Post } from '@nestjs/common'

import { BookService } from '@src/book/book.service'

import { CreateBookDto } from '@src/book/dto'
import { BookEntity } from '@src/book/entities'

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async getAll(): Promise<BookEntity[]> {
    return await this.bookService.getAll()
  }

  @Post()
  async create(@Body() payload: CreateBookDto): Promise<number> {
    return await this.bookService.create(payload)
  }
}
