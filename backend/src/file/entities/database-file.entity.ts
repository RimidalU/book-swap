import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('databaseFile')
export class DatabaseFileEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({
    type: 'bytea',
  })
  data: Uint8Array
}
