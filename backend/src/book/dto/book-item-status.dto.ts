import { ApiProperty } from '@nestjs/swagger'

export class BorrowerInfo {
  @ApiProperty({
    example: 12,
    description: 'Borrower id',
  })
  readonly id: number

  @ApiProperty({
    example: 'Don Dou',
    description: 'Borrower Name',
  })
  readonly name: string

  @ApiProperty({
    example: 12,
    description: 'Borrower avatar id',
  })
  avatarId?: number
}

export class BookItemStatusDto {
  @ApiProperty({
    example: true,
    description: 'Book is borrowed',
  })
  readonly isBorrowed: boolean

  @ApiProperty({ description: 'Borrower info' })
  readonly borrower: BorrowerInfo

  @ApiProperty({ description: 'Borrowers Queue' })
  readonly borrowersIdsQueue: number[]
}
