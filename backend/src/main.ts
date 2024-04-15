import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'

import { AppModule } from '@src/app.module'
import { ValidationPipe } from '@nestjs/common'

import { initSwagger } from '@src/app.swagger'
import { HttpExtendedExceptionFilter } from '@src/filters'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalFilters(new HttpExtendedExceptionFilter())

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  const config = await app.get(ConfigService)

  const port = +config.get<number>('API_PORT') || 3000

  initSwagger(app)

  await app.listen(port, () =>
    console.log(`Server is listening on port ${port}`),
  )
}

bootstrap()
