import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { ProfileService } from './profile.service'
import {
  ImpossibleSubscribeException,
  ProfileNotFoundException,
} from '@src/profile/exceptions'
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
            save: jest.fn().mockReturnValue(''),
            findOne: jest.fn().mockReturnValue({
              ...profileItem,
              subscriptions: [currentUserId],
            }),
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

  describe('get-profile method', () => {
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

  describe('follow-profile method', () => {
    it('followProfile should be returned correct id ', async () => {
      expect(
        await service.followProfile(currentUserId, profileItem.id),
      ).toEqual(profileItem.id)

      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        id: profileItem.id,
      })
    })

    it('followProfile with wrong id should throw an exception', async () => {
      userRepository.findOne = jest.fn().mockReturnValue(undefined)

      await expect(
        service.followProfile(currentUserId, profileItem.id),
      ).rejects.toThrowError(ProfileNotFoundException)
    })

    it('followProfile with id === current user id should throw an exception', async () => {
      await expect(
        service.unFollowProfile(currentUserId, currentUserId),
      ).rejects.toThrowError(ImpossibleSubscribeException)
    })
  })

  describe('unfollow-profile method', () => {
    it('unfollowProfile should be returned correct id ', async () => {
      expect(
        await service.unFollowProfile(currentUserId, profileItem.id),
      ).toEqual(profileItem.id)

      expect(userRepository.findOne).toHaveBeenCalledWith({
        relations: ['subscriptions'],
        where: {
          id: currentUserId,
        },
      })
    })

    it('unfollowProfile with wrong id should throw an exception', async () => {
      userRepository.findOne = jest.fn().mockReturnValue(undefined)

      await expect(
        service.unFollowProfile(currentUserId, profileItem.id),
      ).rejects.toThrowError(ProfileNotFoundException)
    })
  })
})
