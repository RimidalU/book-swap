import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: async (configService: ConfigService) =>
        await {
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
          useUTC: true,
        },
    }),
  ],
})
export class DatabaseModule {}
