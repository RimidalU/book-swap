import { Body, Controller, Post } from '@nestjs/common'

import { BookService } from './book.service'

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async create(@Body() payload: any): Promise<number> {
    return await this.bookService.create(payload)
  }
}
