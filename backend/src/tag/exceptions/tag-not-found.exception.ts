import { NotFoundException } from '@nestjs/common'

export class TagNotFoundException extends NotFoundException {
  constructor(payload: number) {
    super(`Tag with id ${payload} not found`)
  }
}
