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
import { CreateTagDto } from './dto'
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
import { BookResponseDto, BooksResponseDto } from '@src/book/dto'
import { TagsQueryInterface } from '@src/tag/types'

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
    type: BooksResponseDto,
  })
  @ApiQuery({ name: 'name', required: false, description: 'Tag name' })
  async getAll(@Query() query: TagsQueryInterface) {
    return await this.tagService.findAll(query)
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
    type: BookResponseDto,
  })
  async getById(@Param('id') id: string) {
    return await this.tagService.getById(+id)
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
}
