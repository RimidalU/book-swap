import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common'
import { TagService } from './tag.service'
import {
  CreateTagDto,
  TagItemDto,
  TagResponseDto,
  TagsResponseDto,
} from './dto'
import { ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard'
import { TagConfirmationResponseDto } from '@src/tag/dto'
import { TagsQueryInterface } from '@src/tag/types'
import { TagEntity } from './entities'
import {
  CreateSwaggerDecorator,
  GetAllSwaggerDecorator,
  GetByIdSwaggerDecorator,
  RemoveSwaggerDecorator,
} from '@src/tag/decorators'

@ApiTags('Tag routes')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @CreateSwaggerDecorator()
  async create(
    @Body() payload: CreateTagDto,
  ): Promise<TagConfirmationResponseDto> {
    const tagId = await this.tagService.create(payload)

    return this.buildTagConfirmationResponse(tagId)
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @GetAllSwaggerDecorator()
  async getAll(@Query() query: TagsQueryInterface): Promise<TagsResponseDto> {
    const tags = await this.tagService.findAll(query)

    return {
      tags: tags.map((tag) => this.buildTagResponse(tag)),
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @GetByIdSwaggerDecorator()
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TagResponseDto> {
    const tag = await this.tagService.getById(id)

    return {
      tag: this.buildTagResponse(tag),
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @RemoveSwaggerDecorator()
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TagConfirmationResponseDto> {
    const tagId = await this.tagService.remove(id)

    return this.buildTagConfirmationResponse(tagId)
  }

  private buildTagConfirmationResponse(
    tagId: number,
  ): TagConfirmationResponseDto {
    return {
      tag: {
        itemId: tagId,
      },
    }
  }

  private buildTagResponse(tag: TagEntity): TagItemDto {
    return {
      itemId: tag.id,
      item: {
        name: tag.name,
      },
    }
  }
}
