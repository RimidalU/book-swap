import { Module } from '@nestjs/common'

import { UserModule } from '@src/user'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { ConfigService } from '@nestjs/config'

import { LocalStrategy } from './local.strategy'
import { JwtStrategy } from '@src/auth/jwt.strategy'
import { getJwtModuleConfig } from '@src/configs'

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtModuleConfig,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
