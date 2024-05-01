import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'

export const getTypeormModuleConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  return {
    type: configService.getOrThrow<'postgres'>('TYPEORM_CONNECTION'),
    username: configService.getOrThrow<string>('TYPEORM_USER'),
    password: configService.getOrThrow<string>('TYPEORM_PASSWORD'),
    database: configService.getOrThrow<string>('TYPEORM_DATABASE'),
    port: configService.getOrThrow<number>('TYPEORM_PORT'),
    host: configService.getOrThrow<string>('TYPEORM_HOST'),
    entities: [__dirname + '../../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/**/*{.ts,js}'],
    synchronize: false,
    autoLoadEntities: true,
    useUTC: true,
    ssl: process.env.NODE_ENV === 'prod',
  }
}
