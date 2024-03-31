import { NotFoundException } from '@nestjs/common'

export class UserNotFoundException extends NotFoundException {
  constructor(payload: { [key: string]: string | number }) {
    super(`User with ${payload} not found`)
  }
}
