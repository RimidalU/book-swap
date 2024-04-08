import { NotFoundException } from '@nestjs/common'

export class BookNotFoundException extends NotFoundException {
  constructor(payload: number) {
    super(`Book with id ${payload} not found`)
  }
}
