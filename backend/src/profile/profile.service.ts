import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UserEntity } from '@src/user/entities'

import { UserNotFoundException } from '@src/user/exceptions'
import { ProfileType } from '@src/profile/types'

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getProfile(currentUserId: number, id: number): Promise<ProfileType> {
    const user = await this.userRepository.findOneBy({ id })
    if (!user) {
      throw new UserNotFoundException({ id })
    }

    const newProfile = { ...user, following: false }
    return newProfile
  }
}
