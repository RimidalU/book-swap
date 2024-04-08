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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard'
import { TagConfirmationResponseDto } from '@src/tag/dto'
import { TagsQueryInterface } from '@src/tag/types'
import { TagEntity } from './entities'

@ApiTags('Tag routes')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create Tag' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiCreatedResponse({
    description: 'Tag created',
    type: TagConfirmationResponseDto,
  })
  async create(
    @Body() payload: CreateTagDto,
  ): Promise<TagConfirmationResponseDto> {
    const tagId = await this.tagService.create(payload)

    return this.buildTagConfirmationResponse(tagId)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all Tags' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiResponse({
    status: 200,
    description: 'The found records',
    type: TagsResponseDto,
  })
  @ApiQuery({ name: 'name', required: false, description: 'Tag name' })
  async getAll(@Query() query: TagsQueryInterface): Promise<TagsResponseDto> {
    const tags = await this.tagService.findAll(query)

    return {
      tags: tags.map((tag) => this.buildTagResponse(tag)),
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get Tag by id' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: TagResponseDto,
  })
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TagResponseDto> {
    const tag = await this.tagService.getById(id)

    return {
      tag: this.buildTagResponse(tag),
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Remove Tag' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotAcceptableResponse({ description: 'Not Acceptable' })
  @ApiResponse({
    status: 200,
    description: 'Tag removed',
    type: TagConfirmationResponseDto,
  })
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
