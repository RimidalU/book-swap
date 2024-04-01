import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const UserInfo = createParamDecorator(
  (data: any, input: ExecutionContext) => {
    const request = input.switchToHttp().getRequest()

    if (!request.user) {
      return null
    }

    if (data) {
      return request.user[data]
    }
    return request.user
  },
)
