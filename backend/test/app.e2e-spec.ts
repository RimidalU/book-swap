import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'

import { AppModule } from '@src/app.module'
import { TypeOrmCoreModule } from '@nestjs/typeorm/dist/typeorm-core.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { bookItem } from '@src/book/mocks'
import { DataSource } from 'typeorm'
import { BookEntity } from '@src/book/entities'
import { userItem } from '@src/user/mocks'
import { UserEntity } from '@src/user/entities'

describe('AppController (e2e)', () => {
  let app: INestApplication
  let bookId: number
  let userId: number
  let dataSource: DataSource
  const wrongId = 100500

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
    await dataSource.createQueryBuilder().delete().from(UserEntity).execute()
  })

  afterAll(async () => {
    await dataSource.createQueryBuilder().delete().from(BookEntity).execute()
    await dataSource.createQueryBuilder().delete().from(UserEntity).execute()
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

    it('GET - 404', () => {
      return request(app.getHttpServer()).get(`/book/${wrongId}`).expect(404)
    })

    it('GET - 400', () => {
      const wrongStringId = 'wrongStringId'
      return request(app.getHttpServer())
        .get(`/book/${wrongStringId}`)
        .expect(400)
    })

    it('PATCH - 200', () => {
      return request(app.getHttpServer())
        .patch(`/book/${bookId}`)
        .expect(200)
        .then((resp) => {
          bookId = +resp.text
        })
    })

    it('PATCH - 404', () => {
      return request(app.getHttpServer()).patch(`/book/${wrongId}`).expect(404)
    })

    it('PATCH - 400', () => {
      const wrongStringId = 'wrongStringId'
      return request(app.getHttpServer())
        .patch(`/book/${wrongStringId}`)
        .expect(400)
    })

    it('DELETE - 200', () => {
      return request(app.getHttpServer())
        .delete(`/book/${bookId}`)
        .expect(200)
        .then((resp) => {
          bookId = +resp.text
        })
    })

    it('DELETE - 404', () => {
      return request(app.getHttpServer()).delete(`/book/${wrongId}`).expect(404)
    })

    it('DELETE - 400', () => {
      const wrongStringId = 'wrongStringId'
      return request(app.getHttpServer())
        .delete(`/book/${wrongStringId}`)
        .expect(400)
    })
  })

  describe('/user', () => {
    it('POST - 200', () => {
      return request(app.getHttpServer())
        .post('/user')
        .send({
          name: userItem.name,
          bio: userItem.bio,
          email: userItem.email,
          password: userItem.password,
        })
        .expect(201)
        .then((resp) => {
          userId = +resp.text
        })
    })

    it('POST - 400', () => {
      return request(app.getHttpServer())
        .post('/user')
        .send({
          name: userItem.name,
          bio: userItem.bio,
          email: userItem.email,
          password: userItem.password,
          wrongField: 'wrongValue',
        })
        .expect(400)
    })

    it('GET - 200', async () => {
      return await request(app.getHttpServer())
        .get('/user/')
        .expect(200)
        .then((resp) => {
          const arr: UserEntity[] = JSON.parse(resp.text)
          expect(arr[0].id).toBe(userId)
          expect(arr[0].name).toBe(userItem.name)
        })
    })
  })

  describe('/user/:id', () => {
    it('GET - 200', () => {
      return request(app.getHttpServer())
        .get(`/user/${userId}`)
        .expect(200)
        .then((resp) => {
          const userItem: UserEntity = JSON.parse(resp.text)
          expect(userItem.id).toBe(userId)
          expect(userItem.name).toBe(userItem.name)
        })
    })

    it('GET - 404', () => {
      return request(app.getHttpServer()).get(`/user/${wrongId}`).expect(404)
    })

    it('GET - 400', () => {
      const wrongStringId = 'wrongStringId'
      return request(app.getHttpServer())
        .get(`/user/${wrongStringId}`)
        .expect(400)
    })

    it('PATCH - 200', () => {
      return request(app.getHttpServer())
        .patch(`/user/${userId}`)
        .expect(200)
        .then((resp) => {
          userId = +resp.text
        })
    })

    it('PATCH - 404', () => {
      return request(app.getHttpServer()).patch(`/user/${wrongId}`).expect(404)
    })

    it('PATCH - 400', () => {
      const wrongStringId = 'wrongStringId'
      return request(app.getHttpServer())
        .patch(`/user/${wrongStringId}`)
        .expect(400)
    })

    it('DELETE - 200', () => {
      return request(app.getHttpServer())
        .delete(`/user/${userId}`)
        .expect(200)
        .then((resp) => {
          userId = +resp.text
        })
    })

    it('DELETE - 404', () => {
      return request(app.getHttpServer()).delete(`/user/${wrongId}`).expect(404)
    })

    it('DELETE - 400', () => {
      const wrongStringId = 'wrongStringId'
      return request(app.getHttpServer())
        .delete(`/user/${wrongStringId}`)
        .expect(400)
    })
  })
})
