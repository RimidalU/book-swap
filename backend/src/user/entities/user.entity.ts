import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import * as bcrypt from 'bcrypt'

import { IsEmail, IsEmpty } from 'class-validator'

const saltOrRounds = 10

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

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, saltOrRounds)
  }
}
