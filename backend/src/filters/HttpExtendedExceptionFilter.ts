import {
  ExceptionFilter,
  ArgumentsHost,
  Catch,
  HttpException,
} from '@nestjs/common'
import { Response } from 'express'
import { ExpressRequestType } from '@src/user/types'

@Catch(HttpException)
export class HttpExtendedExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<ExpressRequestType>()
    const status = exception.getStatus()

    response.status(status).json({
      exception: {
        statusCode: status,
        message: exception.message,
        timestamp: new Date().toISOString(),
        path: request.url,
        userInfo: {
          id: request.user?.id ?? null,
        },
        payload: request.body,
      },
    })
  }
}
