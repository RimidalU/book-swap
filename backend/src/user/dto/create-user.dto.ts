import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { IsOptional } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Don Dou',
    description: 'User Name',
  })
  readonly name: string

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    uniqueItems: true,
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

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'All this happened back in...',
    description: 'Interesting stories from my life',
  })
  readonly bio?: string

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'don-dou.png',
    description: 'User Avatar',
  })
  readonly avatar?: string
}
