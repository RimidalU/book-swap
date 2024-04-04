import { ApiProperty } from '@nestjs/swagger'

class BorrowerInfo {
  @ApiProperty({
    example: 12,
    description: 'Borrower id',
  })
  readonly borrowerId: number

  @ApiProperty({
    example: 'Don Dou',
    description: 'Borrower Name',
  })
  readonly borrowerName: string
}

export class BookItemStatusDto {
  @ApiProperty({
    example: true,
    description: 'User id',
  })
  readonly isBorrowed: boolean

  @ApiProperty({ description: 'Borrower info' })
  readonly borrower: BorrowerInfo

  @ApiProperty({ description: 'Borrowers Queue' })
  readonly borrowersQueue: BorrowerInfo[]
}
