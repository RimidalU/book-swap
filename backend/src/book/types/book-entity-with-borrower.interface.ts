import { BorrowerInfo } from '@src/book/dto/book-item-status.dto'
import { BookEntityWithInFavoritesInterface } from '@src/book/types/book-entity-with-In-favorites.interface'

export interface BookEntityWithBorrowerInterface
  extends BookEntityWithInFavoritesInterface {
  inFavorites: boolean
  borrowerInfo?: BorrowerInfo
}
