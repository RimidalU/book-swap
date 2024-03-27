import {
  AfterUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { IsEmpty } from 'class-validator'

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

  @Column()
  owner: number

  @Column('boolean', { default: false })
  isBorrowed: boolean

  @IsEmpty()
  @Column({ nullable: true })
  borrower?: number

  @Column('simple-array')
  borrowersQueue: number[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @AfterUpdate()
  checkIsBorrowed() {
    this.borrower ? (this.isBorrowed = true) : false
  }
}
