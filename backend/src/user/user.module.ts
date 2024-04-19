import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { FileModule } from '@src/file/file.module'
import { UserController } from './user.controller'
import { UserService } from './user.service'

import { UserEntity } from '@src/user/entities'

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), FileModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
