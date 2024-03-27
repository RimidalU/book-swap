import { NotFoundException } from '@nestjs/common'

export class BookNotFoundException extends NotFoundException {
  constructor(payload: string) {
    super(`Book with id ${payload} not found`)
  }
}
