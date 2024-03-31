import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { DatabaseModule } from '@src/database'
import { BookModule } from '@src/book'
import { UserModule } from '@src/user'
import { EnvModule } from '@src/env'

import { AppController } from '@src/app.controller'
import { AppService } from '@src/app.service'

import { envSchema } from '@src/env'
import { AuthModule } from './auth'

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
