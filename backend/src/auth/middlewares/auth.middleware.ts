import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common'
import { Response, NextFunction } from 'express'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { ExpressRequestType } from '@src/user/types'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async use(req: ExpressRequestType, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null
      next()
      return
    }
    try {
      const token = req.headers.authorization.split(' ')[1]
      const secretOrKey = await this.configService.getOrThrow<string>(
        'JWT_CONSTANTS_SECRET',
      )
      const payload = await this.jwtService.verifyAsync(token, {
        secret: secretOrKey,
      })
      req['user'] = payload
    } catch {
      throw new UnauthorizedException()
    }
    next()
  }
}
