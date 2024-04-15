import { ApiBody } from '@nestjs/swagger'

export const ApiFile =
  (fileName: string = 'file'): MethodDecorator =>
  (
    target: unknown,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    ApiBody({
      required: true,
      schema: {
        type: 'object',
        properties: {
          [fileName]: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })(target, propertyKey, descriptor)
  }
