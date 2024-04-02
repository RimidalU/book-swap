import { UserType } from '@src/user/types'

export const userItem: UserType = {
  id: 11,
  name: 'User Name',
  bio: 'User Name bio',
  avatar: 'Link to avatar',
  email: 'user@email.com',
  password: '$2a$10$e4O2ybUAsEfQfFiW8r1Ag.00kFv9a/4ZdUZbgrwSjsR7FBzMmHNpO',
  token: null,
  favorites: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  books: [],
}
export const ownerMockId = 123

export const correctUserPassword = 'sdfsdfsdfsf'

export const newItemInfo = {
  name: userItem.name,
  bio: userItem.bio,
  email: userItem.email,
  password: userItem.password,
}
