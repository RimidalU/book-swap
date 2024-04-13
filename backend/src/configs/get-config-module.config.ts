import { envSchema } from '@src/env'
import { ConfigModuleOptions } from '@nestjs/config'

export const getConfigModuleConfig = (): ConfigModuleOptions => {
  return {
    isGlobal: true,
    validate: (env) => envSchema.parse(env),
    envFilePath: '../.env',
  }
}
