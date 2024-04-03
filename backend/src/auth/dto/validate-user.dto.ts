import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ValidateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'don-dou@email.com',
    description: 'User Email',
  })
  readonly email: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Don-Dou#Password91',
    description: 'Strong Password',
  })
  readonly password: string
}
