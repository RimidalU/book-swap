import { BadRequestException } from '@nestjs/common'

export class BookNotUpdatedException extends BadRequestException {
  constructor(name: number) {
    super(`Book with id ${name} cannot be updated.`)
  }
}
