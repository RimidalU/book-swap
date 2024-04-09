import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UserEntity } from '@src/user/entities'

import { ProfileType } from '@src/profile/types'
import { ProfileNotFoundException } from '@src/profile/exceptions'

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getProfile(currentUserId: number, id: number): Promise<ProfileType> {
    const user = await this.userRepository.findOneBy({ id })
    if (!user) {
      throw new ProfileNotFoundException({ id })
    }

    const newProfile = { ...user, following: false }
    return newProfile
  }
}
