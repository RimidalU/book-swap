import { UserType } from '@src/book/types/book.type'

export const bookItem: UserType = {
  id: 12,
  name: 'Book Name',
  author: 'Book Author',
  year: 2022,
  description: 'Book Description',
  condition: 4,
  owner: 10,
  isBorrowed: false,
  borrower: null,
  borrowersQueue: [],
  createdAt: new Date(),
  updatedAt: new Date(),
}
export const ownerMockId = 123
