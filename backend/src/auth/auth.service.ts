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
    console.log(email, password)
    const user = await this.usersService.getByEmail(email)
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
