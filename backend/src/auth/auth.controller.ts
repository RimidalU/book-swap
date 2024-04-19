import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { AuthService } from '@src/auth/auth.service'
import { LocalAuthGuard } from '@src/auth/local-auth.guard'
import { LoginSwaggerDecorator } from '@src/auth/decorators'

import { ValidateUserDto } from '@src/auth/dto'
import { LoginResponseDto } from '@src/auth/dto/login-response.dto'

@ApiTags('Auth routes')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @LoginSwaggerDecorator()
  async login(
    @Body() createUserDto: ValidateUserDto,
    @Request() req,
  ): Promise<LoginResponseDto> {
    return this.authService.login(req.user)
  }
}
