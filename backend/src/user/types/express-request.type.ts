import { UserEntity } from '@src/user/entities'
import { Request } from 'express'

export type ExpressRequestType = Request & { user?: UserEntity }
