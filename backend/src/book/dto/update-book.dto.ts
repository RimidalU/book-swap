import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class UpdateBookDto {
  @IsString()
  @IsOptional()
  readonly name?: string

  @IsString()
  @IsOptional()
  readonly author?: string

  @IsNumber()
  @IsOptional()
  readonly year?: number

  @IsString()
  @IsOptional()
  readonly description?: string

  @IsNumber()
  @IsOptional()
  readonly condition?: number

  @IsNumber()
  @IsOptional()
  readonly owner?: string

  @IsBoolean()
  @IsOptional()
  readonly isBorrowed?: boolean

  @IsNumber()
  @IsOptional()
  readonly borrower?: string

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  readonly borrowersQueue?: number[]
}
