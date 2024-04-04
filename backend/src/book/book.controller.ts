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
  BookResponseDto,
  BooksResponseDto,
  CreateBookDto,
  UpdateBookDto,
} from '@src/book/dto'
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard'
import { UserInfo } from '@src/user/decorators/user-info.decorator'

import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { ShortBookItemDto } from '@src/book/dto'
import {
  BookEntityWithInFavoritesInterface,
  QueryInterface,
} from '@src/book/types'

@ApiTags('Book routes')
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

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
    const bookId = await this.bookService.create(currentUserId, payload)

    return this.buildBookConfirmationResponse(bookId)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update Book by id' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotAcceptableResponse({ description: 'Not Acceptable' })
  @ApiOkResponse({
    description: 'Book Updated',
    type: BookConfirmationResponseDto,
  })
  async update(
    @UserInfo('id') currentUserId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateBookDto,
  ): Promise<BookConfirmationResponseDto> {
    const bookId = await this.bookService.update(currentUserId, id, payload)

    return this.buildBookConfirmationResponse(bookId)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Get All Books' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiResponse({
    status: 200,
    description: 'The found records',
    type: BooksResponseDto,
  })
  @ApiQuery({ name: 'limit', required: false, description: 'Items on page' })
  @ApiQuery({ name: 'offset', required: false, description: 'Offset on page' })
  @ApiQuery({
    name: 'owner',
    required: false,
    description: 'Owner name(complete match)',
  })
  @ApiQuery({ name: 'name', required: false, description: 'Book name' })
  @ApiQuery({ name: 'author', required: false, description: 'Author name' })
  // @ApiQuery({ name: 'tag' ,required: false, description: 'Tags'})                                           TODO: implements tags
  @ApiQuery({
    name: 'selectedUser',
    required: false,
    description: "Books in this user's favorites",
  })
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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get Book by id' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: BookResponseDto,
  })
  async getById(
    @Param('id', ParseIntPipe) id: number,
    @UserInfo('id') currentUserId: number,
  ): Promise<BookResponseDto> {
    const bookInfo = await this.bookService.getById(currentUserId, id)

    return {
      book: this.buildBookResponse(bookInfo),
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Remove Book' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotAcceptableResponse({ description: 'Not Acceptable' })
  @ApiResponse({
    status: 200,
    description: 'Book removed',
    type: BookConfirmationResponseDto,
  })
  async remove(
    @UserInfo('id') currentUserId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BookConfirmationResponseDto> {
    const bookId = await this.bookService.remove(currentUserId, id)

    return this.buildBookConfirmationResponse(bookId)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('favorites/:id')
  @ApiOperation({ summary: 'Add Book to favorites' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotAcceptableResponse({ description: 'Not Acceptable' })
  @ApiResponse({
    status: 200,
    description: 'Book added to favorites',
    type: BookConfirmationResponseDto,
  })
  async addToFavorites(
    @UserInfo('id') currentUserId: number,
    @Param('id', ParseIntPipe) bookId: number,
  ): Promise<BookConfirmationResponseDto> {
    const id = await this.bookService.addToFavorites(currentUserId, bookId)

    return this.buildBookConfirmationResponse(id)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('favorites/:id')
  @ApiOperation({ summary: 'Remove Book from favorites' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotAcceptableResponse({ description: 'Not Acceptable' })
  @ApiResponse({
    status: 200,
    description: 'Book removed to favorites',
    type: BookConfirmationResponseDto,
  })
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
        likes: book.likes,
        ownerId: book.owner.id,
        ownerAvatar: book.owner.avatar,
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
