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

import {
  BookConfirmationResponseDto,
  BookItemDto,
  CreateBookDto,
  UpdateBookDto,
} from '@src/book/dto'
import { BookEntity } from '@src/book/entities'
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard'
import { UserInfo } from '@src/user/decorators/user-info.decorator'
import { BooksResponseInterface } from '@src/book/types/books-response.interface'
import { QueryInterface } from '@src/book/types'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { ShortBookItemDto } from '@src/book/dto'

@ApiTags('Book routes')
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async getAll(
    @UserInfo('id') currentUserId: number,
    @Query() query: QueryInterface,
  ): Promise<BooksResponseInterface> {
    return await this.bookService.getAll(currentUserId, query)
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<BookEntity> {
    return await this.bookService.getById(id)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create Book' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiCreatedResponse({
    description: 'Book created',
    type: BookConfirmationResponseDto,
  })
  async create(
    @UserInfo('id') currentUserId: number,
    @Body() payload: CreateBookDto,
  ): Promise<BookConfirmationResponseDto> {
    const bookId =  await this.bookService.create(currentUserId, payload)

    return this.buildBookConfirmationResponse((bookId))
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

  @UseGuards(JwtAuthGuard)
  @Post('favorites/:id')
  async addToFavorites(
    @UserInfo('id') currentUserId: number,
    @Param('id', ParseIntPipe) bookId: number,
  ): Promise<number> {
    return await this.bookService.addToFavorites(currentUserId, bookId)
  }

  @UseGuards(JwtAuthGuard)
  @Delete('favorites/:id')
  async removeFromFavorites(
    @UserInfo('id') currentUserId: number,
    @Param('id', ParseIntPipe) bookId: number,
  ): Promise<number> {
    return await this.bookService.removeFromFavorites(currentUserId, bookId)
  }

  private buildShortBookResponse(
    book: BookEntity,
    inFavorites = false,
  ): ShortBookItemDto {
    return {
      itemId: book.id,
      item: {
        name: book.name,
        author: book.author,
        year: book.year,
        description: book.description,
        condition: book.condition,
        likes: book.likes,
        ownerId: book.owner.id,
        ownerAvatar: book.owner.avatar,
        inFavorites: inFavorites,
      },
    }
  }

  private buildBookResponse(book: BookEntity): BookItemDto {
    return {
      ...this.buildShortBookResponse(book),
      itemStatus: {
        isBorrowed: book.isBorrowed,
        borrower: {
          borrowerName: 'book.borrower.name',
          borrowerId: 11,
        },
        // borrowersQueue: book.borrowersQueue,  TODO: add borrowersQueue
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
