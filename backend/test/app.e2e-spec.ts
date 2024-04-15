import { Test, TestingModule } from '@nestjs/testing'
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common'
import * as request from 'supertest'

import { AppModule } from '@src/app.module'
import { TypeOrmCoreModule } from '@nestjs/typeorm/dist/typeorm-core.module'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { BookEntity } from '@src/book/entities'
import { UserEntity } from '@src/user/entities'
import { correctUserPassword, userItem } from '@src/user/mocks'
import { bookItem } from '@src/book/mocks'
import { DataSource } from 'typeorm'
import {
  BookConfirmationResponseDto,
  BookResponseDto,
  BooksResponseDto,
} from '@src/book/dto'
import { TagEntity } from '@src/tag/entities'
import {
  UserConfirmationResponseDto,
  UserResponseDto,
  UsersResponseDto,
} from '@src/user/dto'

describe('AppController (e2e)', () => {
  let app: INestApplication
  let bookId: number
  let userId: number
  let dataSource: DataSource
  const wrongId = 100500
  const wrongStringId = 'wrongStringId'
  let token: string
  let userIdForRemove: number

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
    await dataSource.createQueryBuilder().delete().from(TagEntity).execute()

    return request(app.getHttpServer())
      .post('/user')
      .send({
        name: userItem.name,
        bio: userItem.bio,
        email: userItem.email,
        password: correctUserPassword,
      })
      .then((resp) => {
        const response: UserConfirmationResponseDto = JSON.parse(resp.text)
        userId = response.user.itemId
      })
  })

  afterAll(async () => {
    await dataSource.createQueryBuilder().delete().from(BookEntity).execute()
    await dataSource.createQueryBuilder().delete().from(UserEntity).execute()
    await dataSource.createQueryBuilder().delete().from(TagEntity).execute()

    await app.close()
  })

  describe('/auth/login', () => {
    it('POST - 200', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: userItem.email,
          password: correctUserPassword,
        })
        .expect(201)
        .then((resp: request.Response) => {
          const response = JSON.parse(resp.text)
          expect(response).toBeDefined()
          token = response.access_token
        })
    })

    it('POST - 401', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: userItem.email,
          password: wrongStringId,
        })
        .expect(401, {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Unauthorized',
        })
    })

    it('POST - 404', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: wrongStringId,
          password: correctUserPassword,
        })
        .expect(404)
    })
  })

  describe('/', () => {
    it('GET - 200', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!')
    })
  })

  describe('/user', () => {
    it('POST - 201', () => {
      return request(app.getHttpServer())
        .post('/user')
        .send({
          name: userItem.name,
          bio: userItem.bio,
          email: userItem.email + 'new',
          password: correctUserPassword,
        })
        .expect(201)
        .then((resp: request.Response) => {
          const response: UserConfirmationResponseDto = JSON.parse(resp.text)
          userIdForRemove = response.user.itemId
          expect(response.user.itemId).toBeDefined()
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
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then((resp: request.Response) => {
          const arr: UsersResponseDto = JSON.parse(resp.text)
          expect(arr.users[0].itemId).toBe(userId)
          expect(arr.users[0].item.name).toBe(userItem.name)
        })
    })
  })

  describe('/user/:id', () => {
    it('GET - 200', () => {
      return request(app.getHttpServer())
        .get(`/user/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then((resp: request.Response) => {
          const user: UserResponseDto = JSON.parse(resp.text)
          expect(user.user.itemId).toBe(userId)
          expect(user.user.item.name).toBe(userItem.name)
        })
    })

    it('GET - 404', () => {
      return request(app.getHttpServer())
        .get(`/user/${wrongId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
    })

    it('GET - 400', () => {
      const wrongStringId = 'wrongStringId'
      return request(app.getHttpServer())
        .get(`/user/${wrongStringId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
    })

    it('PATCH - 200', () => {
      return request(app.getHttpServer())
        .patch(`/user/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then((resp: request.Response) => {
          const response: UserConfirmationResponseDto = JSON.parse(resp.text)
          expect(response.user.itemId).toBeDefined()
          response.user.itemId = userId
        })
    })

    it('PATCH - 406', () => {
      return request(app.getHttpServer())
        .patch(`/user/${wrongId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(406)
    })

    it('PATCH - 400', () => {
      const wrongStringId = 'wrongStringId'
      return request(app.getHttpServer())
        .patch(`/user/${wrongStringId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
    })

    it('DELETE - 406', () => {
      return request(app.getHttpServer())
        .delete(`/user/${wrongId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(406)
    })

    it('DELETE - 400', () => {
      const wrongStringId = 'wrongStringId'
      return request(app.getHttpServer())
        .delete(`/user/${wrongStringId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
    })

    let tokenForRemove: number

    beforeAll(() => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: userItem.email + 'new',
          password: correctUserPassword,
        })
        .then((resp: request.Response) => {
          const response = JSON.parse(resp.text)
          expect(response.access_token).toBeDefined()
          tokenForRemove = response.access_token
        })
    })

    it('DELETE - 200', () => {
      return request(app.getHttpServer())
        .delete(`/user/${userIdForRemove}`)
        .set('Authorization', `Bearer ${tokenForRemove}`)
        .expect(200)
        .then((resp: request.Response) => {
          const response: UserConfirmationResponseDto = JSON.parse(resp.text)
          expect(response.user.itemId).toBe(userIdForRemove)
        })
    })
  })

  describe('/book', () => {
    it('POST - 200', () => {
      return request(app.getHttpServer())
        .post('/book')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: bookItem.name,
          author: bookItem.author,
          condition: bookItem.condition,
          year: bookItem.year,
          description: bookItem.description,
        })
        .expect(201)
        .then((resp: request.Response) => {
          const res: BookConfirmationResponseDto = JSON.parse(resp.text)
          expect(res.book.itemId).toBeDefined()
          bookId = res.book.itemId
        })
    })

    it('POST - 400', () => {
      return request(app.getHttpServer())
        .post('/book')
        .set('Authorization', `Bearer ${token}`)
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
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then((resp: request.Response) => {
          const response: BooksResponseDto = JSON.parse(resp.text)
          expect(response.books[0].itemId).toBe(bookId)
          expect(response.books[0].item.name).toBe(bookItem.name)
        })
    })
  })

  describe('/book/:id', () => {
    it('GET - 200', () => {
      return request(app.getHttpServer())
        .get(`/book/${bookId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then((resp: request.Response) => {
          const response: BookResponseDto = JSON.parse(resp.text)
          expect(response.book.itemId).toBe(bookId)
          expect(response.book.item.name).toBe(bookItem.name)
        })
    })

    it('GET - 404', () => {
      return request(app.getHttpServer())
        .get(`/book/${wrongId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
    })

    it('GET - 400', () => {
      const wrongStringId = 'wrongStringId'
      return request(app.getHttpServer())
        .get(`/book/${wrongStringId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
    })

    it('PATCH - 200', () => {
      return request(app.getHttpServer())
        .patch(`/book/${bookId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then((resp: request.Response) => {
          const response: BookConfirmationResponseDto = JSON.parse(resp.text)
          expect(response.book.itemId).toBe(bookId)
        })
    })

    it('PATCH - 404', () => {
      return request(app.getHttpServer())
        .patch(`/book/${wrongId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
    })

    it('PATCH - 400', () => {
      return request(app.getHttpServer())
        .patch(`/book/${wrongStringId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
    })

    it('DELETE - 200', () => {
      return request(app.getHttpServer())
        .delete(`/book/${bookId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then((resp: request.Response) => {
          const response: BookConfirmationResponseDto = JSON.parse(resp.text)
          expect(response.book.itemId).toBe(bookId)
        })
    })

    it('DELETE - 404', () => {
      return request(app.getHttpServer())
        .delete(`/book/${wrongId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
    })

    it('DELETE - 400', () => {
      const wrongStringId = 'wrongStringId'
      return request(app.getHttpServer())
        .delete(`/book/${wrongStringId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
    })
  })
})
