import { Body, Controller, Post } from '@nestjs/common'

import { BookService } from '@src/book/book.service'
import { CreateBookDto } from '@src/book/dto'

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async create(@Body() payload: CreateBookDto): Promise<number> {
    return await this.bookService.create(payload)
  }
}
