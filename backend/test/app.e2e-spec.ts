import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'

import { AppModule } from '@src/app.module'
import { TypeOrmCoreModule } from '@nestjs/typeorm/dist/typeorm-core.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { bookItem } from '@src/book/mocks'

describe('AppController (e2e)', () => {
  let app: INestApplication
  // let bookId: number

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmCoreModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],

          useFactory: async (configService: ConfigService) => ({
            type: configService.getOrThrow<'postgres'>('TYPEORM_CONNECTION'),
            username: configService.getOrThrow<string>('TYPEORM_USER'),
            password: configService.getOrThrow<string>('TYPEORM_PASSWORD'),
            database: configService.getOrThrow<string>('TYPEORM_DATABASE'),
            port: configService.getOrThrow<number>('TYPEORM_PORT'),
            host: configService.getOrThrow<string>('TYPEORM_HOST'),
            entities: [__dirname + '../../**/*.entity{.ts,.js}'],
            migrations: [__dirname + '/migrations/**/*{.ts,js}'],
            synchronize: false,
            logging: true,
            autoLoadEntities: true,
          }),
        }),
      ],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  describe('/', () => {
    it('GET - 200', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!')
    })
  })

  describe('/book', () => {
    it('POST - 200', () => {
      return request(app.getHttpServer())
        .post('/book')
        .send({
          name: bookItem.name,
          author: bookItem.author,
          condition: bookItem.condition,
          year: bookItem.year,
          description: bookItem.description,
        })
        .expect(201)
      // .then((resp) => {
      //   bookId = +resp.text
      // })
    })
  })
})
