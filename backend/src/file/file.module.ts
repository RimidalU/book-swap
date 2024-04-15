import { Module } from '@nestjs/common'

import { ServeStaticModule } from '@nestjs/serve-static'

import { FileController } from './file.controller'
import { FileService } from './file.service'

import { path } from 'app-root-path'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      serveStaticOptions: { index: false },
      serveRoot: '/static',
      rootPath: `${path}/uploads`,
      exclude: ['/api/(.*)'],
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
