import { BookEntity } from '@src/book/entities'

export type UserType = Omit<BookEntity, 'checkIsBorrowed'>
