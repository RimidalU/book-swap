import {BadRequestException} from '@nestjs/common'

export class ImpossibleSubscribeException extends BadRequestException {
  constructor(payload: { [key: string]: string | number }) {
    super(`Impossible to subscribe to yourself. Your ID ${payload}`)
  }
}
