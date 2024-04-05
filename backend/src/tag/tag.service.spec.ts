import { Test, TestingModule } from '@nestjs/testing'
import { TagService } from './tag.service'
import { DataSource, Repository } from 'typeorm'
import { TagEntity } from '@src/tag/entities'
import { getRepositoryToken } from '@nestjs/typeorm'
import { tagItem } from '@src/tag/mocks/tag-item.mock'
import { userItem } from '@src/user/mocks'
import { TagNotFoundException } from '@src/tag/exceptions'

describe('TagService', () => {
  let service: TagService
  let dataSource: DataSource
  let tagRepository: Repository<TagEntity>

  const TAG_REPOSITORY_TOKEN = getRepositoryToken(TagEntity)

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagService,
        {
          provide: TAG_REPOSITORY_TOKEN,
          useValue: {
            save: jest.fn().mockReturnValue(tagItem),
            findAll: jest.fn().mockReturnValue([tagItem]),
            findOneBy: jest.fn().mockReturnValue(tagItem),
            remove: jest.fn().mockReturnValue(tagItem),

            createQueryBuilder: jest.fn(() => ({
              where: jest.fn().mockReturnThis(),
              setParameter: jest.fn().mockReturnThis(),
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockReturnThis(),
            })),
          },
        },
        {
          provide: DataSource,
          useValue: {
            getRepository: jest.fn().mockImplementation(() => ({
              createQueryBuilder: jest.fn().mockImplementation(() => ({
                getMany: jest.fn().mockReturnValue([tagItem]),
              })),
            })),
          },
        },
      ],
    }).compile()

    service = module.get(TagService)
    tagRepository = module.get(TAG_REPOSITORY_TOKEN)
    dataSource = module.get(DataSource)
  })

  it('TagService should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should tagRepository be defined', () => {
    expect(tagRepository).toBeDefined()
  })

  it('should dataSource be defined', () => {
    expect(dataSource).toBeDefined()
  })

  describe('create tag method', () => {
    it('check the tag created', async () => {
      expect(await service.create({ name: tagItem.name })).toBe(tagItem.id)
      expect(tagRepository.save).toHaveBeenCalledWith({ name: tagItem.name })
    })
  })

  describe('getById method', () => {
    it('the tag with correct id should be returned', async () => {
      expect(await service.getById(tagItem.id)).toEqual({
        id: 11,
        name: 'User Name',
      })

      expect(tagRepository.findOneBy).toHaveBeenCalledWith({
        id: userItem.id,
      })
    })

    it('getById tag with wrong id should throw an exception', async () => {
      tagRepository.findOneBy = jest.fn().mockReturnValue(undefined)

      await expect(service.getById(tagItem.id)).rejects.toThrowError(
        TagNotFoundException,
      )
    })
  })

  describe('remove method', () => {
    it('remove the tag with correct id should be returned tag id', async () => {
      expect(await service.remove(tagItem.id)).toEqual(tagItem.id)

      expect(await tagRepository.findOneBy).toHaveBeenCalledWith({
        id: tagItem.id,
      })
      expect(tagRepository.remove).toHaveBeenCalledWith(tagItem)
    })

    it('remove tag with wrong id should throw an exception', async () => {
      tagRepository.findOneBy = jest.fn().mockReturnValue(undefined)

      await expect(service.remove(tagItem.id)).rejects.toThrowError(
        TagNotFoundException,
      )
    })
  })

  describe('getAll tags method', () => {
    it('the array of tags should be returned', async () => {
      expect(await service.findAll(tagItem.name)).toEqual(
        expect.arrayContaining([expect.objectContaining({ ...tagItem })]),
      )

      expect(
        dataSource.getRepository('TagEntity').createQueryBuilder().getMany(),
      ).toEqual([tagItem])
    })
  })
})
