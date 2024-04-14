import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

import { AuthMiddleware } from './auth.middleware'

describe('AuthMiddleware', () => {
  let authMiddleware: AuthMiddleware
  let configService: ConfigService
  let jwtService: JwtService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthMiddleware, ConfigService, JwtService],
    }).compile()

    authMiddleware = module.get(AuthMiddleware)
    configService = module.get(ConfigService)
    jwtService = module.get(JwtService)
  })

  it('authMiddleware should be defined', () => {
    expect(authMiddleware).toBeDefined()
  })

  it('configService should be defined', () => {
    expect(configService).toBeDefined()
  })
  it('jwtService should be defined', () => {
    expect(jwtService).toBeDefined()
  })
})
