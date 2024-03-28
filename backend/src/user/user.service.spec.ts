import { Test, TestingModule } from '@nestjs/testing'
import {getRepositoryToken} from "@nestjs/typeorm";

import { UserService } from './user.service'
import {Repository} from "typeorm";

import {UserEntity} from "@src/user/entities";

describe('UserService', () => {
  let service: UserService
let userRepository: Repository<UserEntity>

  const USER_REPOSITORY_TOKEN = getRepositoryToken(UserEntity)

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {},
        },
      ],
    }).compile()

    service = module.get(UserService)
    userRepository = module.get(USER_REPOSITORY_TOKEN)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should bookRepository be defined', () => {
    expect(userRepository).toBeDefined()
  })
})
