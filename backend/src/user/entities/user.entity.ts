import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import * as bcrypt from 'bcrypt'

import { IsEmail, IsEmpty } from 'class-validator'
import { BookEntity } from '@src/book/entities'
import { ApiProperty } from '@nestjs/swagger'

const saltOrRounds = 10

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @ApiProperty({
    example: 'Don Dou',
    description: 'User Name',
  })
  name: string

  @IsEmpty()
  @ApiProperty({
    example: 'All this happened back in...',
    description: 'Interesting stories from my life',
  })
  @Column('text', { nullable: true })
  bio?: string

  @IsEmpty()
  @Column('text', { nullable: true })
  avatar?: string

  @IsEmail()
  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, saltOrRounds)
  }

  @OneToMany(() => BookEntity, (book) => book.owner)
  books: BookEntity[]

  @ManyToMany(() => BookEntity)
  @JoinTable()
  favorites: BookEntity[]
}
