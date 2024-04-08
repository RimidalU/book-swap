import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthService } from '@src/auth/auth.service'

import { userItem } from '../user/mocks'

describe('AuthController', () => {
  let controller: AuthController
  let service: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn().mockReturnValue(userItem),
          },
        },
      ],
    }).compile()

    controller = module.get(AuthController)
    service = module.get(AuthService)
  })

  it('controller should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('service should be defined', () => {
    expect(service).toBeDefined()
  })
})
