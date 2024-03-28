import { Test, TestingModule } from '@nestjs/testing'

import { UserController } from './user.controller'
import {UserService} from "@src/user/user.service";


describe('UserController', () => {
  let controller: UserController
  let service: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {},
        },
      ],
    }).compile()

    controller = module.get(UserController)
    service = module.get(UserService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('service should be defined', () => {
    expect(service).toBeDefined()
  })
})
