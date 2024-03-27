import { Test, TestingModule } from '@nestjs/testing'
import { EnvService } from './env.service'
import { ConfigService } from '@nestjs/config'

describe('EnvService', () => {
  let service: EnvService
  let configService: ConfigService
  const apiPort = 1234

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnvService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(apiPort),
          },
        },
      ],
    }).compile()

    service = module.get(EnvService)
    configService = module.get(ConfigService)
  })

  it('EnvService should be defined', () => {
    expect(service).toBeDefined()
  })

  it('ConfigService should be defined', () => {
    expect(configService).toBeDefined()
  })

  it('the envValue should be returned', async () => {
    expect(service.get('API_PORT')).toEqual(apiPort)

    expect(configService.get).toHaveBeenCalledWith('API_PORT', { infer: true })
  })
})
