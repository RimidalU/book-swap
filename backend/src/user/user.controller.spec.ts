import { Test, TestingModule } from '@nestjs/testing'

import { UserController } from './user.controller'
import { UserService } from '@src/user/user.service'
import { newItemInfo, userItem } from './mocks'

describe('UserController', () => {
  let controller: UserController
  let service: UserService
  const currentUserId = userItem.id

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn().mockReturnValue(userItem.id),
            getAll: jest.fn().mockReturnValue([userItem]),
            getById: jest.fn().mockReturnValue(userItem),
            remove: jest.fn().mockReturnValue(userItem.id),
            update: jest.fn().mockReturnValue(userItem.id),
          },
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

  describe('create book method', () => {
    it('check the book created', async () => {
      expect(await controller.create(newItemInfo)).toEqual({
        user: {
          itemId: userItem.id,
        },
      })

      expect(service.create).toHaveBeenCalledWith({
        ...newItemInfo,
      })
    })
  })

  describe('get all books method', () => {
    it('check returned array of books', async () => {
      expect(await controller.getAll()).toEqual({
        users: [
          {
            itemId: userItem.id,
            item: {
              name: userItem.name,
              bio: userItem.bio,
              avatar: userItem.avatar,
            },
          },
        ],
      })

      expect(service.getAll).toHaveBeenCalledWith()
    })
  })

  describe('getById book method', () => {
    it('check returned books with current id', async () => {
      expect(await controller.getById(userItem.id)).toEqual({
        user: {
          itemId: userItem.id,
          item: {
            name: userItem.name,
            bio: userItem.bio,
            avatar: userItem.avatar,
          },
        },
      })

      expect(service.getById).toHaveBeenCalledWith(userItem.id)
    })
  })

  describe('remove book method', () => {
    it('check returned book id', async () => {
      expect(await controller.remove(userItem.id, currentUserId)).toEqual({
        user: {
          itemId: userItem.id,
        },
      })

      expect(service.remove).toHaveBeenCalledWith(userItem.id)
    })
  })

  describe('update book method', () => {
    it('check returned updated book with current id', async () => {
      expect(
        await controller.update(userItem.id, newItemInfo, currentUserId),
      ).toEqual({
        user: {
          itemId: userItem.id,
        },
      })

      expect(service.update).toHaveBeenCalledWith(userItem.id, newItemInfo)
    })
  })
})
