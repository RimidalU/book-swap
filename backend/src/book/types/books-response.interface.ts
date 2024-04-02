import { BookEntityWithInFavoritesInterface } from '@src/book/types/book-entity-with-In-favorites.interface'

export interface BooksResponseInterface {
  books: BookEntityWithInFavoritesInterface[]
  count: number
}
