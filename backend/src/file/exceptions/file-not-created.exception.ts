import { BadRequestException } from '@nestjs/common'

export class FileNotCreatedException extends BadRequestException {
  constructor(name: string) {
    super(`File with name ${name} cannot be created.`)
  }
}
