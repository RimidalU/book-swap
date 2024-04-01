import { Test, TestingModule } from '@nestjs/testing'

import { AuthService } from './auth.service'
import { UserService } from '@src/user'
import { JwtService } from '@nestjs/jwt'

import { correctUserPassword, userItem } from '@src/user/mocks'

describe('AuthService', () => {
  let service: AuthService
  let userService: UserService
  let jwtService: JwtService
  const { password, ...userItemValid } = userItem
  const mockJwtToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzYsIm5hbWUiOiJVc2VyIE5hbWUiLCJlbWFpbCI6InVzZXJAZWRkbWFpbC5jb20iLCJpYXQiOjE3MTE5NjA4NjcsImV4cCI6MTcxMTk2MDkyN30.8Kqn3HGIkTdUKlluAyvGydTw2azL22trL6lzwFWtjO4'

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            getByEmail: jest.fn().mockReturnValue(userItem),
          },
        },
        JwtService,
        {
          provide: JwtService,
          useValue: {
            secret: process.env.JWT_CONSTANTS_SECRET,
            sign: jest.fn().mockReturnValue(mockJwtToken),
          },
        },
      ],
    }).compile()

    service = module.get(AuthService)
    userService = module.get(UserService)
    jwtService = module.get(JwtService)
  })

  it('AuthService should be defined', () => {
    expect(service).toBeDefined()
  })

  it('UserService should be defined', () => {
    expect(userService).toBeDefined()
  })

  describe('validateUser method', () => {
    it('the user with correct email and password should be returned', async () => {
      expect(
        await service.validateUser({
          email: userItem.email,
          password: correctUserPassword,
        }),
      ).toEqual(userItemValid)

      expect(userService.getByEmail).toHaveBeenCalledWith(userItem.email)
    })

    it('validateUser user with wrong password should throw an exception', async () => {
      await expect(
        await service.validateUser({
          email: userItem.email,
          password: 'wrong password',
        }),
      ).toEqual(null)
    })

    it('validateUser user with wrong email should throw an exception', async () => {
      userService.getByEmail = jest.fn().mockReturnValue(undefined)

      await expect(
        await service.validateUser({
          email: userItem.email,
          password: correctUserPassword,
        }),
      ).toEqual(null)
    })
  })

  describe('login method', () => {
    it('the login with correct user should be return access token', async () => {
      expect(await service.login(userItemValid)).toEqual({
        access_token: mockJwtToken,
      })

      expect(jwtService.sign).toHaveBeenCalledWith({
        id: userItem.id,
        email: userItem.email,
        name: userItem.name,
      })
    })
  })
})
