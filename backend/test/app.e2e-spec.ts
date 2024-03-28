import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'

import { AppModule } from '@src/app.module'
import { TypeOrmCoreModule } from '@nestjs/typeorm/dist/typeorm-core.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { bookItem } from '@src/book/mocks'
import { DataSource } from 'typeorm'
import { BookEntity } from '@src/book/entities'

describe('AppController (e2e)', () => {
  let app: INestApplication
  let bookId: number
  let dataSource: DataSource

  beforeAll(async () => {
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
            entities: [__dirname + '../**/*.entity{.ts,.js}'],
            migrations: [__dirname + '../migrations/**/*{.ts,js}'],
            synchronize: true,
            logging: true,
            useUTC: true,
            autoLoadEntities: true,
          }),
        }),
      ],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    )
    await app.init()

    dataSource = app.get(DataSource)
    await dataSource.createQueryBuilder().delete().from(BookEntity).execute()
  })

  afterAll(async () => {
    await dataSource.createQueryBuilder().delete().from(BookEntity).execute()
    await app.close()
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
        .then((resp) => {
          bookId = +resp.text
        })
    })

    it('POST - 400', () => {
      return request(app.getHttpServer())
        .post('/book')
        .send({
          name: bookItem.name,
          author: bookItem.author,
          condition: bookItem.condition,
          year: bookItem.year,
          wrongField: 'wrongValue',
        })
        .expect(400)
    })

    it('GET - 200', async () => {
      return await request(app.getHttpServer())
        .get('/book/')
        .expect(200)
        .then((resp) => {
          const arr: BookEntity[] = JSON.parse(resp.text)
          expect(arr[0].id).toBe(bookId)
          expect(arr[0].name).toBe(bookItem.name)
        })
    })

    it('GET - 200', async () => {
      return await request(app.getHttpServer())
        .get('/book/')
        .expect(200)
        .then((resp) => {
          const arr: BookEntity[] = JSON.parse(resp.text)
          expect(arr[0].id).toBe(bookId)
          expect(arr[0].name).toBe(bookItem.name)
        })
    })
  })

  describe('/book/:id', () => {
    it('GET - 200', () => {
      return request(app.getHttpServer())
        .get(`/book/${bookId}`)
        .expect(200)
        .then((resp) => {
          const bookItem: BookEntity = JSON.parse(resp.text)
          expect(bookItem.id).toBe(bookId)
          expect(bookItem.name).toBe(bookItem.name)
        })
    })
  })
})
