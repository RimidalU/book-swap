import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { BookController } from '@src/book/book.controller'
import { BookService } from '@src/book/book.service'

import { BookEntity } from '@src/book/entities'

@Module({
  imports: [TypeOrmModule.forFeature([BookEntity])],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
