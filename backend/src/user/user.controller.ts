import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common'

import { UserService } from '@src/user/user.service'

import { UserEntity } from '@src/user/entities'
import { CreateUserDto, UpdateUserDto } from '@src/user/dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll(): Promise<UserEntity[]> {
    return await this.userService.getAll()
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    return await this.userService.getById(id)
  }

  @Post()
  async create(@Body() payload: CreateUserDto): Promise<number> {
    return await this.userService.create(payload)
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<number> {
    return await this.userService.remove(id)
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateUserDto,
  ): Promise<number> {
    return await this.userService.update(id, payload)
  }
}
