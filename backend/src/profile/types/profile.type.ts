import { UserType } from '@src/user/types'

export type ProfileType = UserType & { inSubscriptions?: boolean }
