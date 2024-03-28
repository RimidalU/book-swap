import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common'

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

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<BookEntity> {
    return await this.bookService.getById(id)
  }

  @Post()
  async create(@Body() payload: CreateBookDto): Promise<number> {
    return await this.bookService.create(payload)
  }
}
