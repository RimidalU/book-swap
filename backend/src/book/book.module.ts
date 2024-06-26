import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { BookController } from '@src/book/book.controller'
import { BookService } from '@src/book/book.service'
import { BookStockCycleLoggerMiddleware } from '@src/book/middleware'

import { BookEntity } from '@src/book/entities'
import { UserModule } from '@src/user'
import { UserEntity } from '@src/user/entities'
import { FileModule } from '@src/file/file.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([BookEntity, UserEntity]),
    UserModule,
    FileModule,
  ],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(BookStockCycleLoggerMiddleware)
      .forRoutes(
        { method: RequestMethod.DELETE, path: 'book/:id' },
        { method: RequestMethod.POST, path: 'book' },
      )
  }
}
