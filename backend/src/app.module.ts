import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { DatabaseModule } from '@src/database'
import { BookModule } from '@src/book'
import { UserModule } from '@src/user'
import { EnvModule } from '@src/env'

import { AppController } from '@src/app.controller'
import { AppService } from '@src/app.service'
import { AuthMiddleware, AuthModule } from './auth'
import { JwtModule } from '@nestjs/jwt'
import { TagModule } from './tag/tag.module'
import { ProfileModule } from './profile/profile.module'

import { getConfigModuleConfig } from '@src/configs'
import { FileModule } from './file/file.module'

@Module({
  imports: [
    ConfigModule.forRoot(getConfigModuleConfig()),
    EnvModule,
    DatabaseModule,
    AuthModule,
    UserModule,
    ProfileModule,
    BookModule,
    JwtModule,
    TagModule,
    FileModule,
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
