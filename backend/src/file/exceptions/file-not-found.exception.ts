import { NotFoundException } from '@nestjs/common'

export class FileNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`File with id '${id}' not found`)
  }
}
