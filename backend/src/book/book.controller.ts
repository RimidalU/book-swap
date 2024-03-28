import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common'

import { BookService } from '@src/book/book.service'

import { CreateBookDto, UpdateBookDto } from '@src/book/dto'
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

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<number> {
    return await this.bookService.remove(id)
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateBookDto,
  ): Promise<number> {
    return await this.bookService.update(id, payload)
  }
}
