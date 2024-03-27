import { IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { IsOptional } from 'class-validator'

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string

  @IsString()
  @IsNotEmpty()
  readonly author: string

  @IsNumber()
  @IsOptional()
  readonly year?: number

  @IsString()
  @IsOptional()
  readonly description?: string

  @IsNumber()
  @IsNotEmpty()
  readonly condition: number
}
