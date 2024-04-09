import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { ProfileService } from './profile.service'
import { ProfileNotFoundException } from '@src/profile/exceptions'
import { UserEntity } from '../user/entities'

import { UserService } from '../user'
import { profileItem } from './mocks'

describe('ProfileService', () => {
  let service: ProfileService
  let userRepository: Repository<UserEntity>
  const currentUserId = 1

  const USER_REPOSITORY_TOKEN = getRepositoryToken(UserEntity)

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        UserService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            findOneBy: jest.fn().mockReturnValue(profileItem),
          },
        },
      ],
    }).compile()

    service = module.get(ProfileService)
    userRepository = module.get(USER_REPOSITORY_TOKEN)
  })

  it('service should be defined', () => {
    expect(service).toBeDefined()
  })

  it('user-repository should be defined', () => {
    expect(userRepository).toBeDefined()
  })

  describe('getProfile method', () => {
    it('the profile with correct id should be returned', async () => {
      expect(await service.getProfile(currentUserId, profileItem.id)).toEqual(
        profileItem,
      )

      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        id: profileItem.id,
      })
    })

    it('getProfile with wrong id should throw an exception', async () => {
      userRepository.findOneBy = jest.fn().mockReturnValue(undefined)

      await expect(
        service.getProfile(currentUserId, profileItem.id),
      ).rejects.toThrowError(ProfileNotFoundException)
    })
  })
})
