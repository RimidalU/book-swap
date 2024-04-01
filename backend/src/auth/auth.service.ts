import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

import { UserService } from '@src/user'
import { JwtService } from '@nestjs/jwt'

import { ValidateUserDto } from '@src/auth/dto'
import { UserValidatedType } from '@src/auth/types'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser({
    email,
    password,
  }: ValidateUserDto): Promise<UserValidatedType | null> {
    const user = await this.usersService.getByEmail(email)
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  async login(user: UserValidatedType) {
    const payload = { id: user.id, name: user.name, email: user.email }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
