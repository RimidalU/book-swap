import { IsEmail, IsOptional, IsString } from 'class-validator'

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  readonly name?: string

  @IsEmail()
  @IsOptional()
  readonly email?: string

  @IsString()
  @IsOptional()
  readonly password?: string

  @IsString()
  @IsOptional()
  readonly bio?: string

  @IsString()
  @IsOptional()
  readonly avatar?: string

  @IsString()
  @IsOptional()
  readonly token?: string
}
