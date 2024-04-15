import { BadRequestException } from '@nestjs/common'

export class UserNotCreatedException extends BadRequestException {
  constructor(email: string) {
    super(`User cannot be created. Email '${email}' already exists`)
  }
}
