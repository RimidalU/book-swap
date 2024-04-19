import { NotFoundException } from '@nestjs/common'

export class FileNotFoundException extends NotFoundException {
  constructor(payload: { [key: string]: string | number }) {
    super(`File with ${payload} not found`)
  }
}
