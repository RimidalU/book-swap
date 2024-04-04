import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'

import { UserService } from '@src/user/user.service'

import { UserEntity } from '@src/user/entities'
import {
  CreateUserDto,
  UpdateUserDto,
  UserConfirmationResponseDto,
  UserItemDto,
  UserResponseDto,
  UsersResponseDto,
} from '@src/user/dto'
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { NotAcceptableException } from '@nestjs/common/exceptions/not-acceptable.exception'
import { UserInfo } from '@src/user/decorators/user-info.decorator'

@Controller('user')
@ApiTags('User routes')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create User' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiCreatedResponse({
    description: 'User created',
    type: UserConfirmationResponseDto,
  })
  async create(
    @Body() payload: CreateUserDto,
  ): Promise<UserConfirmationResponseDto> {
    const userId = await this.userService.create(payload)

    return this.buildUserConfirmationResponse(userId)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update User by id' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotAcceptableResponse({ description: 'Not Acceptable' })
  @ApiOkResponse({
    description: 'User Updated',
    type: UserConfirmationResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateUserDto,
    @UserInfo('id') currentUserId: number,
  ): Promise<UserConfirmationResponseDto> {
    if (id !== currentUserId) {
      throw new NotAcceptableException()
    }

    const userId = await this.userService.update(id, payload)

    return this.buildUserConfirmationResponse(userId)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get All Users' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiResponse({
    status: 200,
    description: 'The found records',
    type: UsersResponseDto,
  })
  async getAll(): Promise<UsersResponseDto> {
    const users = await this.userService.getAll()

    return {
      users: users.map((user) => this.buildUserResponse(user)),
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get User by id' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: UserResponseDto,
  })
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    const userInfo = await this.userService.getById(id)

    return {
      user: this.buildUserResponse(userInfo),
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Remove User' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotAcceptableResponse({ description: 'Not Acceptable' })
  @ApiResponse({
    status: 200,
    description: 'User removed',
    type: UserConfirmationResponseDto,
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @UserInfo('id') currentUserId: number,
  ): Promise<UserConfirmationResponseDto> {
    if (id !== currentUserId) {
      throw new NotAcceptableException()
    }

    const userId = await this.userService.remove(id)

    return this.buildUserConfirmationResponse(userId)
  }

  private buildUserResponse(user: UserEntity): UserItemDto {
    return {
      itemId: user.id,
      item: {
        name: user.name,
        bio: user.bio,
        avatar: user.avatar,
      },
    }
  }

  private buildUserConfirmationResponse(
    userId: number,
  ): UserConfirmationResponseDto {
    return {
      user: {
        itemId: userId,
      },
    }
  }
}
