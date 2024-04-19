import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'

import { BookService } from '@src/book/book.service'

import { JwtAuthGuard } from '@src/auth/jwt-auth.guard'
import { UserInfo } from '@src/user/decorators/user-info.decorator'
import { ApiTags } from '@nestjs/swagger'
import {
  GetAllSwaggerDecorator,
  AddToFavoritesSwaggerDecorator,
  CreateSwaggerDecorator,
  GetByAdSwaggerDecorator,
  UpdateSwaggerDecorator,
  RemoveSwaggerDecorator,
  RemoveFromFavoritesSwaggerDecorator,
  MyFeedSwaggerDecorator,
} from '@src/book/decorators'

import { ShortBookItemDto } from '@src/book/dto'
import {
  BookEntityWithInFavoritesInterface,
  QueryInterface,
} from '@src/book/types'
import {
  BookConfirmationResponseDto,
  BookItemDto,
  BookResponseDto,
  BooksResponseDto,
  CreateBookDto,
  UpdateBookDto,
} from '@src/book/dto'

@ApiTags('Book routes')
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @CreateSwaggerDecorator()
  async create(
    @UserInfo('id') currentUserId: number,
    @Body() payload: CreateBookDto,
  ): Promise<BookConfirmationResponseDto> {
    const bookId = await this.bookService.create(currentUserId, payload)

    return this.buildBookConfirmationResponse(bookId)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UpdateSwaggerDecorator()
  async update(
    @UserInfo('id') currentUserId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateBookDto,
  ): Promise<BookConfirmationResponseDto> {
    const bookId = await this.bookService.update(currentUserId, id, payload)

    return this.buildBookConfirmationResponse(bookId)
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @GetAllSwaggerDecorator()
  async getAll(
    @UserInfo('id') currentUserId: number,
    @Query() query: QueryInterface,
  ): Promise<BooksResponseDto> {
    const { books, count } = await this.bookService.getAll(currentUserId, query)

    return {
      books: books.map((book) => this.buildShortBookResponse(book)),
      count,
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('feed')
  @MyFeedSwaggerDecorator()
  async myFeed(
    @UserInfo('id') currentUserId: number,
    @Query() query: QueryInterface,
  ): Promise<BooksResponseDto> {
    const { books, count } = await this.bookService.myFeed(currentUserId, query)

    return {
      books: books.map((book) => this.buildShortBookResponse(book)),
      count,
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @GetByAdSwaggerDecorator()
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @UserInfo('id') currentUserId: number,
  ): Promise<BookResponseDto> {
    const bookInfo = await this.bookService.getById(currentUserId, id)

    return {
      book: this.buildBookResponse(bookInfo),
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @RemoveSwaggerDecorator()
  async remove(
    @UserInfo('id') currentUserId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BookConfirmationResponseDto> {
    const bookId = await this.bookService.remove(currentUserId, id)

    return this.buildBookConfirmationResponse(bookId)
  }

  @UseGuards(JwtAuthGuard)
  @Post('favorites/:id')
  @AddToFavoritesSwaggerDecorator()
  async addToFavorites(
    @UserInfo('id') currentUserId: number,
    @Param('id', ParseIntPipe) bookId: number,
  ): Promise<BookConfirmationResponseDto> {
    const id = await this.bookService.addToFavorites(currentUserId, bookId)

    return this.buildBookConfirmationResponse(id)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('favorites/:id')
  @RemoveFromFavoritesSwaggerDecorator()
  async removeFromFavorites(
    @UserInfo('id') currentUserId: number,
    @Param('id', ParseIntPipe) bookId: number,
  ): Promise<BookConfirmationResponseDto> {
    const id = await this.bookService.removeFromFavorites(currentUserId, bookId)

    return this.buildBookConfirmationResponse(id)
  }

  private buildShortBookResponse(
    book: BookEntityWithInFavoritesInterface,
  ): ShortBookItemDto {
    return {
      itemId: book.id,
      item: {
        name: book.name,
        author: book.author,
        year: book.year,
        description: book.description,
        condition: book.condition,
        tags: book.tags,
        likes: book.likes,
        ownerId: book.owner.id,
        ownerAvatar: book.owner.avatar.id,
        inFavorites: book.inFavorites,
      },
    }
  }

  private buildBookResponse(
    book: BookEntityWithInFavoritesInterface,
  ): BookItemDto {
    return {
      ...this.buildShortBookResponse(book),
      itemStatus: {
        isBorrowed: book.isBorrowed,
        borrower: {
          borrowerName: 'book.borrower.name', // TODO: add borrowerName
          borrowerId: null, // // TODO: add borrowerId
        },
        borrowersQueue: [], // TODO: add borrowersQueue
      },
    }
  }

  private buildBookConfirmationResponse(
    bookId: number,
  ): BookConfirmationResponseDto {
    return {
      book: {
        itemId: bookId,
      },
    }
  }
}
