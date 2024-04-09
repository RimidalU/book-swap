import { Test, TestingModule } from '@nestjs/testing'

import { ProfileController } from './profile.controller'
import { ProfileService } from './profile.service'

import { profileItem } from './mocks'

describe('ProfileController', () => {
  let controller: ProfileController
  let service: ProfileService
  const currentUserId = 1

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: {
            getProfile: jest.fn().mockReturnValue(profileItem),
          },
        },
      ],
    }).compile()

    controller = module.get(ProfileController)
    service = module.get(ProfileService)
  })

  it('controller should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('service should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('get-profile method', () => {
    it('check returned profile with current id', async () => {
      expect(
        await controller.getProfile(profileItem.id, currentUserId),
      ).toEqual({
        profile: {
          itemId: profileItem.id,
          item: {
            name: profileItem.name,
            bio: profileItem.bio,
            avatar: profileItem.avatar,
            following: profileItem.following,
          },
        },
      })

      expect(service.getProfile).toHaveBeenCalledWith(
        currentUserId,
        profileItem.id,
      )
    })
  })
})
