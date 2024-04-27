import { BookType } from '@src/book/types/book.type'
import { UserEntity } from '@src/user/entities'

export const bookItem: BookType = {
  id: 12,
  name: 'Book Name',
  author: 'Book Author',
  year: 2022,
  description: 'Book Description',
  condition: 4,
  tags: ['adventure'],
  owner: new UserEntity(),
  isBorrowed: false,
  borrower: null,
  borrowersIdsQueue: [],
  likes: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
}
export const ownerMockId = 123

export const newItemInfo = {
  name: bookItem.name,
  author: bookItem.author,
  condition: bookItem.condition,
  year: bookItem.year,
  description: bookItem.description,
}
