import { Injectable } from '@nestjs/common'
import { CreateTagDto } from './dto/create-tag.dto'
import { TagEntity } from '@src/tag/entities'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { TagNotFoundException } from '@src/tag/exceptions'

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
    private readonly dataSource: DataSource,
  ) {}
  async create(payload: CreateTagDto): Promise<number> {
    const newTag = new TagEntity()

    Object.assign(newTag, payload)

    const tag = await this.tagRepository.save(newTag)
    return tag.id
  }

  async findAll(query) {
    const queryBuilder = await this.dataSource
      .getRepository(TagEntity)
      .createQueryBuilder('tag')

    if (query.name) {
      queryBuilder.andWhere('tag.name LIKE :name', {
        name: `%${query.name}%`,
      })
    }

    const books = await queryBuilder.getMany()

    return books
  }

  async getById(id: number): Promise<TagEntity> {
    const tag = await this.tagRepository.findOneBy({ id })
    if (!tag) {
      throw new TagNotFoundException(id)
    }
    return tag
  }

  async remove(id: number) {
    const entity = await this.getById(id)

    await this.tagRepository.remove(entity)
    return id
  }
}
