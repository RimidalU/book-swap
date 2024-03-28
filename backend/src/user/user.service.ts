import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { UserEntity } from '@src/user/entities'
import { UserNotFoundException } from '@src/user/exceptions'
import { CreateUserDto, UpdateUserDto } from '@src/user/dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getAll(): Promise<UserEntity[]> {
    return await this.userRepository.find()
  }

  async create(payload: CreateUserDto): Promise<number> {
    const newUser = new UserEntity()
    Object.assign(newUser, payload)

    const user = await this.userRepository.save(newUser)
    return user.id
  }

  async getById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id })
    if (!user) {
      throw new UserNotFoundException(id)
    }
    return user
  }

  async remove(id: number): Promise<number> {
    const entity = await this.getById(id)
    const user = await this.userRepository.remove(entity)
    return user.id
  }

  async update(id: number, payload: UpdateUserDto): Promise<number> {
    const entity = await this.getById(id)
    Object.assign(entity, payload)

    await this.userRepository.save(entity)
    return entity.id
  }
}
