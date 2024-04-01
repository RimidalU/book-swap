import {
  AfterUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { IsEmpty } from 'class-validator'
import { UserEntity } from '@src/user/entities'

@Entity('book')
export class BookEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  author: string

  @IsEmpty()
  @Column('int2', { nullable: true })
  year?: number

  @IsEmpty()
  @Column('text', { nullable: true })
  description?: string

  @Column('int2')
  condition: number

  @ManyToOne(() => UserEntity, (user) => user.books)
  owner: UserEntity

  @Column('boolean', { default: false })
  isBorrowed: boolean

  @IsEmpty()
  @Column({ nullable: true })
  borrower?: number

  @IsEmpty()
  @Column('int', { array: true, default: [] })
  borrowersQueue?: number[]

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date

  @AfterUpdate()
  checkIsBorrowed() {
    this.borrower ? (this.isBorrowed = true) : false
  }
}
