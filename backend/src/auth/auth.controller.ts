import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common'
import { AuthService } from '@src/auth/auth.service'
import { LocalAuthGuard } from '@src/auth/local-auth.guard'
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { ValidateUserDto } from '@src/auth/dto'
import { LoginResponseDto } from '@src/auth/dto/login-response.dto'

@ApiTags('Auth routes')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiOperation({ summary: 'Get Access Token by Email and Password' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiCreatedResponse({
    description: 'Correct User Data',
    type: LoginResponseDto,
  })
  async login(
    @Body() createCatDto: ValidateUserDto,
    @Request() req,
  ): Promise<LoginResponseDto> {
    return this.authService.login(req.user)
  }
}
