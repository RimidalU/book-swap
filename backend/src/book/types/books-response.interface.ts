import { BookEntity } from '@src/book/entities'

export interface BooksResponseInterface {
  books: BookEntity[]
  count: number
}
