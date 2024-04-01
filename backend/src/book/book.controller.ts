import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'

import { BookService } from '@src/book/book.service'

import { CreateBookDto, UpdateBookDto } from '@src/book/dto'
import { BookEntity } from '@src/book/entities'
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard'
import { UserInfo } from '@src/user/decorators/user-info.decorator'

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

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @UserInfo('id') currentUserId: number,
    @Body() payload: CreateBookDto,
  ): Promise<number> {
    return await this.bookService.create(currentUserId, payload)
  }

  @Delete(':id')
  async remove(
    @UserInfo('id') currentUserId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<number> {
    return await this.bookService.remove(currentUserId, id)
  }

  @Patch(':id')
  async update(
    @UserInfo('id') currentUserId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateBookDto,
  ): Promise<number> {
    return await this.bookService.update(currentUserId, id, payload)
  }
}
