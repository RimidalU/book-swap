import { NotFoundException } from '@nestjs/common'

export class UserNotFoundException extends NotFoundException {
  constructor(payload: number) {
    super(`User with id ${payload} not found`)
  }
}
