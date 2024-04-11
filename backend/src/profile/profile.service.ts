import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UserEntity } from '@src/user/entities'

import { ProfileType } from '@src/profile/types'
import {
  ImpossibleSubscribeException,
  ProfileNotFoundException,
} from '@src/profile/exceptions'

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

  async followProfile(currentUserId: number, id: number): Promise<number> {
    const currentUser = await this.getCurrentUser(currentUserId, id)
    const isNotSubscriptions =
      currentUser.subscriptions.findIndex(
        (userInSubscriptions) => userInSubscriptions.id === id,
      ) === -1

    if (isNotSubscriptions) {
      const userForSubscriptions = await this.userRepository.findOneBy({ id })

      currentUser.subscriptions.push(userForSubscriptions)
      await this.userRepository.save(currentUser)
    }

    return id
  }

  async unFollowProfile(currentUserId: number, id: number): Promise<number> {
    const currentUser = await this.getCurrentUser(currentUserId, id)
    const userIndex = currentUser.subscriptions.findIndex(
      (userInSubscriptions) => userInSubscriptions.id === id,
    )
    if (userIndex >= 0) {
      currentUser.subscriptions.splice(userIndex, 1)
      await this.userRepository.save(currentUser)
    }

    return id
  }

  async getCurrentUser(currentUserId: number, id: number): Promise<UserEntity> {
    if (currentUserId === id) {
      throw new ImpossibleSubscribeException({ id })
    }

    const currentUser = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['subscriptions'],
    })
    if (!currentUser) {
      throw new ProfileNotFoundException({ id })
    }
    return currentUser
  }
}
