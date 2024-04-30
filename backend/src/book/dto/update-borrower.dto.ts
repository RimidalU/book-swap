import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional } from 'class-validator'

export class UpdateBorrowerDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 12,
    description: 'Borrower id',
  })
  readonly borrowerId: number | null
}
