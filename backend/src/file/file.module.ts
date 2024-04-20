import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ServeStaticModule } from '@nestjs/serve-static'

import { FileController } from './file.controller'
import { FileService } from './file.service'

import { path } from 'app-root-path'
import { DatabaseFileEntity } from '@src/file/entities'

@Module({
  imports: [
    TypeOrmModule.forFeature([DatabaseFileEntity]),
    ServeStaticModule.forRoot({
      serveStaticOptions: { index: false },
      serveRoot: '/static',
      rootPath: `${path}/uploads/img`,
      exclude: ['/api/(.*)'],
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
