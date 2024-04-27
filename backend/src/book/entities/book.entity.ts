import {
  AfterUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { IsEmpty } from 'class-validator'
import { UserEntity } from '@src/user/entities'
import { DatabaseFileEntity } from '@src/file/entities'

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

  @ManyToOne(() => UserEntity, (user) => user.books, { eager: true })
  owner: UserEntity

  @Column('boolean', { default: false })
  isBorrowed: boolean

  @JoinColumn({ name: 'userId' })
  @OneToOne(() => UserEntity, {
    nullable: true,
  })
  public borrower?: UserEntity

  @IsEmpty()
  @Column({ nullable: true })
  borrowerId?: number

  @IsEmpty()
  @Column('int', { array: true, default: [] })
  borrowersIdsQueue?: number[]

  @IsEmpty()
  @Column('int2', { default: 0 })
  likes: number

  @IsEmpty()
  @Column('simple-array', { default: [] })
  tags?: string[]

  @JoinColumn({ name: 'ebookId' })
  @OneToOne(() => DatabaseFileEntity, {
    nullable: true,
  })
  public ebook?: DatabaseFileEntity

  @IsEmpty()
  @Column({ nullable: true })
  ebookId?: number

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date

  @AfterUpdate()
  checkIsBorrowed() {
    this.borrower ? (this.isBorrowed = true) : false
  }
}
