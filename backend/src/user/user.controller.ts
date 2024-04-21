import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
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
import { ApiTags } from '@nestjs/swagger'
import { NotAcceptableException } from '@nestjs/common/exceptions/not-acceptable.exception'
import {
  GetAllSwaggerDecorator,
  RemoveSwaggerDecorator,
  UserInfo,
} from '@src/user/decorators'
import { FileInterceptor } from '@nestjs/platform-express'
import { UploadFileSwaggerDecorator } from '@src/file/decorators'
import { CreateSwaggerDecorator } from '@src/user/decorators'
import { UpdateSwaggerDecorator } from '@src/user/decorators'
import { GetByIdSwaggerDecorator } from '@src/user/decorators'

@Controller('user')
@ApiTags('User routes')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @CreateSwaggerDecorator()
  async create(
    @Body() payload: CreateUserDto,
  ): Promise<UserConfirmationResponseDto> {
    const userId = await this.userService.create(payload)

    return this.buildUserConfirmationResponse(userId)
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UpdateSwaggerDecorator()
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

  @UseGuards(JwtAuthGuard)
  @Get()
  @GetAllSwaggerDecorator()
  async getAll(): Promise<UsersResponseDto> {
    const users = await this.userService.getAll()

    return {
      users: users.map((user) => this.buildUserResponse(user)),
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @GetByIdSwaggerDecorator()
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    const userInfo = await this.userService.getById(id)

    return {
      user: this.buildUserResponse(userInfo),
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @RemoveSwaggerDecorator()
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

  @UseGuards(JwtAuthGuard)
  @Post('avatar')
  @UploadFileSwaggerDecorator()
  @UseInterceptors(FileInterceptor('img'))
  async addAvatar(
    @UserInfo('id') currentUserId: number,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /.(jpg|jpeg|png|webp)$/,
        })
        .addMaxSizeValidator({
          maxSize: 6 * 1024 * 1024,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ): Promise<UserConfirmationResponseDto> {
    await this.userService.addAvatar(
      currentUserId,
      file.buffer,
      file.originalname,
    )
    return this.buildUserConfirmationResponse(currentUserId)
  }

  private buildUserResponse(user: UserEntity): UserItemDto {
    return {
      itemId: user.id,
      item: {
        name: user.name,
        bio: user.bio,
        avatarId: user.avatarId,
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
