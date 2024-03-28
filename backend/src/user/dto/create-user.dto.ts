import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { IsOptional } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string

  @IsEmail()
  @IsNotEmpty()
  readonly email: string

  @IsString()
  @IsNotEmpty()
  readonly password: string

  @IsString()
  @IsOptional()
  readonly bio?: string

  @IsString()
  @IsOptional()
  readonly avatar?: string
}
