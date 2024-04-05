import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { DatabaseModule } from '@src/database'
import { BookModule } from '@src/book'
import { UserModule } from '@src/user'
import { EnvModule, envSchema } from '@src/env'

import { AppController } from '@src/app.controller'
import { AppService } from '@src/app.service'
import { AuthMiddleware, AuthModule } from './auth'
import { JwtModule } from '@nestjs/jwt'
import { TagModule } from './tag/tag.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => envSchema.parse(env),
      envFilePath: '../.env',
    }),
    EnvModule,
    DatabaseModule,
    BookModule,
    UserModule,
    AuthModule,
    JwtModule,
    TagModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    })
  }
}
