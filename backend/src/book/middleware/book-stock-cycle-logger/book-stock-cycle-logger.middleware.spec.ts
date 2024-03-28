import { BookStockCycleLoggerMiddleware } from './book-stock-cycle-logger.middleware'

describe('BookStockCycleLoggerMiddleware', () => {
  it('should be defined', () => {
    expect(new BookStockCycleLoggerMiddleware()).toBeDefined()
  })
})
