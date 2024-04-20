import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { IsEmpty } from 'class-validator'

@Entity('databaseFile')
export class DatabaseFileEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @IsEmpty()
  @Column({ nullable: true })
  url?: string

  @IsEmpty()
  @Column({
    type: 'bytea',
    nullable: true,
  })
  data?: Uint8Array
}
