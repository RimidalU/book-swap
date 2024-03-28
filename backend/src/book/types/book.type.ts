import { BookEntity } from '@src/book/entities'

export type BookType = Omit<BookEntity, 'checkIsBorrowed'>
