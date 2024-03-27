import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { DatabaseModule } from './database'
import { BookModule } from './book'
import { EnvModule } from './env'

import { AppController } from './app.controller'
import { AppService } from './app.service'

import { envSchema } from './env'

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
