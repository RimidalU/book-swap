import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

@Entity('tag')
export class TagEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @ApiProperty({
    example: 'adventures',
    description: 'Tag Name',
  })
  name: string

  @BeforeInsert()
  convertToLowerCase() {
    this.name = this.name.toLowerCase()
  }
}
