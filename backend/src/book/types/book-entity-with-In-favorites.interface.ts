import { BookType } from '@src/book/types/book.type'

export interface BookEntityWithInFavoritesInterface extends BookType {
  inFavorites: boolean
}
