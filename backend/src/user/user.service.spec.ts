import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'

import { UserService } from './user.service'
import { DataSource, Repository } from 'typeorm'

import { UserEntity } from '@src/user/entities'
import { newItemInfo, userItem } from '@src/user/mocks'
import { UserNotFoundException } from '@src/user/exceptions'
import { FileService } from '@src/file/file.service'
import { DatabaseFileEntity } from '@src/file/entities'

describe('UserService', () => {
  let service: UserService
  let userRepository: Repository<UserEntity>
  let databaseFileEntityRepository: Repository<DatabaseFileEntity>
  let fileService: FileService

  const newUserInfo = {
    name: 'New Name',
    password: '1990',
  }

  const USER_REPOSITORY_TOKEN = getRepositoryToken(UserEntity)
  const DATABASE_FILE_REPOSITORY_TOKEN = getRepositoryToken(DatabaseFileEntity)

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            save: jest.fn().mockReturnValue(userItem),
            find: jest.fn().mockReturnValue([userItem]),
            findOneBy: jest.fn().mockReturnValue(userItem),
            remove: jest.fn().mockReturnValue(userItem),
          },
        },
        FileService,
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: DATABASE_FILE_REPOSITORY_TOKEN,
          useValue: {},
        },
      ],
    }).compile()

    service = module.get(UserService)
    userRepository = module.get(USER_REPOSITORY_TOKEN)
    fileService = module.get(FileService)
    databaseFileEntityRepository = module.get(FileService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should bookRepository be defined', () => {
    expect(userRepository).toBeDefined()
  })

  it('file-service should be defined', () => {
    expect(fileService).toBeDefined()
  })

  it('database-file-entity-repository should be defined', () => {
    expect(databaseFileEntityRepository).toBeDefined()
  })

  describe('getAll users method', () => {
    it('the array of users should be returned', async () => {
      expect(await service.getAll()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            ...userItem,
          }),
        ]),
      )

      expect(userRepository.find).toHaveBeenCalledWith()
    })

    describe('create user method', () => {
      it('check the user created', async () => {
        expect(await service.create(newItemInfo)).toBe(userItem.id)
        expect(userRepository.save).toHaveBeenCalledWith(newItemInfo)
      })
    })

    describe('getById method', () => {
      it('the user with correct id should be returned', async () => {
        expect(await service.getById(userItem.id)).toEqual(userItem)

        expect(userRepository.findOneBy).toHaveBeenCalledWith({
          id: userItem.id,
        })
      })

      it('getById user with wrong id should throw an exception', async () => {
        userRepository.findOneBy = jest.fn().mockReturnValue(undefined)

        await expect(service.getById(userItem.id)).rejects.toThrowError(
          UserNotFoundException,
        )
      })
    })

    describe('remove method', () => {
      it('remove the user with correct id should be returned user id', async () => {
        expect(await service.remove(userItem.id)).toEqual(userItem.id)

        expect(await userRepository.findOneBy).toHaveBeenCalledWith({
          id: userItem.id,
        })
        expect(userRepository.remove).toHaveBeenCalledWith(userItem)
      })

      it('remove user with wrong id should throw an exception', async () => {
        userRepository.findOneBy = jest.fn().mockReturnValue(undefined)

        await expect(service.remove(userItem.id)).rejects.toThrowError(
          UserNotFoundException,
        )
      })
    })

    describe('update method', () => {
      it('update the user with correct id should be returned user id', async () => {
        expect(await service.update(userItem.id, newUserInfo)).toEqual(
          userItem.id,
        )

        expect(await userRepository.findOneBy).toHaveBeenCalledWith({
          id: userItem.id,
        })

        expect(userRepository.save).toHaveBeenCalledWith({
          ...userItem,
          ...newUserInfo,
        })
      })

      it('update user with wrong id should throw an exception', async () => {
        userRepository.findOneBy = jest.fn().mockReturnValue(undefined)

        await expect(
          service.update(userItem.id, newUserInfo),
        ).rejects.toThrowError(UserNotFoundException)
      })
    })

    describe('getByEmail method', () => {
      it('the user with correct id should be returned', async () => {
        expect(await service.getByEmail(userItem.email)).toEqual(userItem)

        expect(userRepository.findOneBy).toHaveBeenCalledWith({
          email: userItem.email,
        })
      })

      it('getByEmail user with wrong id should throw an exception', async () => {
        userRepository.findOneBy = jest.fn().mockReturnValue(undefined)

        await expect(service.getByEmail(userItem.email)).rejects.toThrowError(
          UserNotFoundException,
        )
      })
    })
  })
})
