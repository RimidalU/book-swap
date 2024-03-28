import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { IsEmail, IsEmpty } from 'class-validator'

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @IsEmpty()
  @Column()
  bio?: string

  @IsEmpty()
  @Column()
  avatar?: string

  @IsEmail()
  @Column()
  email: string

  @Column()
  password: string

  @IsEmpty()
  @Column()
  token?: string

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date
}
