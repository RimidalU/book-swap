import { Injectable } from '@nestjs/common'
import { UserService } from '@src/user'

import * as bcrypt from 'bcrypt'
import { ValidateUserDto } from '@src/auth/dto'
import { UserValidatedType } from '@src/auth/types'

@Injectable()
export class AuthService {
  constructor(private usersService: UserService) {}

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
}
