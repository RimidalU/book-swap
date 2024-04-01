import { UserEntity } from '@src/user/entities'
import { Request } from 'express'

export interface ExpressRequestInterface extends Request {
  user?: UserEntity
}
