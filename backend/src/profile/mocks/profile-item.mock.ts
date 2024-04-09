import { ProfileType } from '@src/profile/types'

export const profileItem: ProfileType = {
  id: 11,
  name: 'User Name',
  bio: 'User Name bio',
  avatar: 'Link to avatar',
  email: 'user@email.com',
  password: '$2a$10$e4O2ybUAsEfQfFiW8r1Ag.00kFv9a/4ZdUZbgrwSjsR7FBzMmHNpO',
  favorites: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  books: [],
  following: false,
}
