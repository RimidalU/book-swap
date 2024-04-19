import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { UserEntity } from '@src/user/entities'
import {
  UserNotCreatedException,
  UserNotFoundException,
} from '@src/user/exceptions'
import { CreateUserDto, UpdateUserDto } from '@src/user/dto'
import { FileService } from '@src/file/file.service'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly fileService: FileService,
  ) {}

  async getAll(): Promise<UserEntity[]> {
    return await this.userRepository.find()
  }

  async create(payload: CreateUserDto): Promise<number> {
    const newUser = new UserEntity()
    Object.assign(newUser, payload)

    try {
      const user = await this.userRepository.save(newUser)
      return user.id
    } catch {
      throw new UserNotCreatedException(payload.email)
    }
  }

  async getById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id })
    if (!user) {
      throw new UserNotFoundException({ id })
    }
    return user
  }

  async remove(id: number): Promise<number> {
    const entity = await this.getById(id)
    await this.userRepository.remove(entity)
    return id
  }

  async update(id: number, payload: UpdateUserDto): Promise<number> {
    const entity = await this.getById(id)
    Object.assign(entity, payload)

    await this.userRepository.save(entity)
    return entity.id
  }

  async getByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ email })
    if (!user) {
      throw new UserNotFoundException({ email })
    }
    return user
  }

  async addAvatar(id: number, data: Buffer, name: string) {
    const avatar = await this.fileService.uploadDatabaseFile({ data, name })
    await this.userRepository.update(id, {
      avatarId: avatar.id,
    })
    return avatar.id
  }
}
