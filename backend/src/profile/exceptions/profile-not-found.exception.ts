import { NotFoundException } from '@nestjs/common'

export class ProfileNotFoundException extends NotFoundException {
  constructor(payload: { [key: string]: string | number }) {
    super(`Profile with ${payload} not found`)
  }
}
