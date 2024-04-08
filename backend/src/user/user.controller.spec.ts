import { Test, TestingModule } from '@nestjs/testing'

import { UserController } from './user.controller'
import { UserService } from '@src/user/user.service'
import { newItemInfo, userItem } from './mocks'

describe('UserController', () => {
  let controller: UserController
  let service: UserService

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
      expect(await controller.create(newItemInfo)).toBe(userItem.id)

      expect(service.create).toHaveBeenCalledWith({
        ...newItemInfo,
      })
    })
  })

  describe('get all books method', () => {
    it('check returned array of books', async () => {
      expect(await controller.getAll()).toEqual([userItem])

      expect(service.getAll).toHaveBeenCalledWith()
    })
  })

  describe('getById book method', () => {
    it('check returned books with current id', async () => {
      expect(await controller.getById(userItem.id)).toEqual(userItem)

      expect(service.getById).toHaveBeenCalledWith(userItem.id)
    })
  })

  describe('remove book method', () => {
    it('check returned book id', async () => {
      expect(await controller.remove(userItem.id)).toEqual(userItem.id)

      expect(service.remove).toHaveBeenCalledWith(userItem.id)
    })
  })

  describe('update book method', () => {
    it('check returned updated book with current id', async () => {
      expect(await controller.update(userItem.id, newItemInfo)).toEqual(
        userItem.id,
      )

      expect(service.update).toHaveBeenCalledWith(userItem.id, newItemInfo)
    })
  })
})
