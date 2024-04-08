import { UserEntity } from '@src/user/entities'

export type UserValidatedType = Omit<UserEntity, 'password' | 'hashPassword'>
