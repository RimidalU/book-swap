import { Test, TestingModule } from '@nestjs/testing'

import { TagController } from './tag.controller'
import { TagService } from './tag.service'

import { tagItem } from './mocks'

describe('TagController', () => {
  let controller: TagController
  let service: TagService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagController],
      providers: [
        {
          provide: TagService,
          useValue: {
            create: jest.fn().mockReturnValue(tagItem.id),
            findAll: jest.fn().mockReturnValue([tagItem]),
            getById: jest.fn().mockReturnValue(tagItem),
            remove: jest.fn().mockReturnValue(tagItem.id),
          },
        },
      ],
    }).compile()

    controller = module.get(TagController)
    service = module.get(TagService)
  })

  it('controller should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('service should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create tag method', () => {
    it('check the tag created', async () => {
      expect(await controller.create({ name: tagItem.name })).toEqual({
        tag: {
          itemId: tagItem.id,
        },
      })
      expect(service.create).toHaveBeenCalledWith({ name: tagItem.name })
    })
  })

  describe('getById tag method', () => {
    it('check returned tag with current id', async () => {
      expect(await controller.getById(tagItem.id)).toEqual({
        tag: {
          itemId: tagItem.id,
          item: {
            name: tagItem.name,
          },
        },
      })

      expect(service.getById).toHaveBeenCalledWith(tagItem.id)
    })
  })

  describe('remove tag method', () => {
    it('check returned tag id', async () => {
      expect(await controller.remove(tagItem.id)).toEqual({
        tag: {
          itemId: tagItem.id,
        },
      })

      expect(service.remove).toHaveBeenCalledWith(tagItem.id)
    })
  })

  describe('get all tags method', () => {
    it('check returned array of tags', async () => {
      const query = { tag: 'new-tag' }
      expect(await controller.getAll(query)).toEqual({
        tags: [
          {
            itemId: tagItem.id,
            item: {
              name: tagItem.name,
            },
          },
        ],
      })

      expect(service.findAll).toHaveBeenCalledWith({ tag: 'new-tag' })
    })
  })
})
