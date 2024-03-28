import { Injectable, Logger, NestMiddleware } from '@nestjs/common'

@Injectable()
export class BookStockCycleLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(BookStockCycleLoggerMiddleware.name)
  use(req: Request, res: Response, next: () => void) {
    const { body, method, url } = req
    this.logger.warn(
      `Request from path '${url}' (${method}) is ${JSON.stringify(body, null, 2)}`,
    )
    next()
  }
}
