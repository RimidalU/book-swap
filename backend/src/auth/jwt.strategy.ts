import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'

import { ConfigService } from '@nestjs/config'
import { JwtStrategyValidateType } from '@src/auth/types/jwt-strategy-validate.type'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_CONSTANTS_SECRET'),
    })
  }

  async validate(payload: JwtStrategyValidateType) {
    return { id: payload.id, name: payload.name, email: payload.email }
  }
}
