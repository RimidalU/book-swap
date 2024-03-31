import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UserService } from '@src/user'
import { correctUserPassword, userItem } from '@src/user/mocks'

describe('AuthService', () => {
  let service: AuthService
  let userService: UserService

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
      ],
    }).compile()

    service = module.get(AuthService)
    userService = module.get(UserService)
  })

  it('AuthService should be defined', () => {
    expect(service).toBeDefined()
  })

  it('UserService should be defined', () => {
    expect(userService).toBeDefined()
  })

  describe('validateUser method', () => {
    const { password, ...userItemValid } = userItem

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
})
