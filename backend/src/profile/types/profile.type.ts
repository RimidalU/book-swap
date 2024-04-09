import { UserType } from '@src/user/types'

export type ProfileType = UserType & { following?: boolean }
