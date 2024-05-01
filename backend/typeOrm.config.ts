import { config } from 'dotenv'
import { DataSource } from 'typeorm'

config({
  path: '../.env.dev',
});

export default new DataSource(  {
  type: process.env.TYPEORM_CONNECTION as 'postgres',
  username:  process.env.TYPEORM_USER,
  password:  process.env.TYPEORM_PASSWORD,
  database:  process.env.TYPEORM_DATABASE,
  port:  +process.env.TYPEORM_PORT,
  host:  process.env.TYPEORM_HOST,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + 'src/database/migrations/**/*{.ts,js}'],
  useUTC: true,
  ssl: process.env.NODE_ENV === 'prod',
})