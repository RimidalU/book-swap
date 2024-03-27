import { Body, Controller, Post } from '@nestjs/common'

import { BookService } from './book.service'
import { CreateBookDto } from './dto'

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async create(@Body() payload: CreateBookDto): Promise<number> {
    return await this.bookService.create(payload)
  }
}
