import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

import { CreateBookDto } from '@src/book/dto/create-book.dto'

describe('create-book.dto', () => {
  let dto
  beforeAll(() => {
    dto = {
      name: '',
      author: '',
      year: '',
      description: '',
      condition: '',
    }
  })

  it('name field is empty', async () => {
    const ofImportDTO = plainToInstance(CreateBookDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('name')).toBeTruthy()
  })

  it('name field is not string', async () => {
    dto.name = 12
    const ofImportDTO = plainToInstance(CreateBookDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('name')).toBeTruthy()
  })

  it('name field is correct', async () => {
    dto.name = 'Name'
    const ofImportDTO = plainToInstance(CreateBookDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('name')).toBeFalsy()
  })

  it('author field is empty', async () => {
    const ofImportDTO = plainToInstance(CreateBookDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('author')).toBeTruthy()
  })

  it('author field is not string', async () => {
    dto.author = 12
    const ofImportDTO = plainToInstance(CreateBookDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('author')).toBeTruthy()
  })

  it('author field is correct', async () => {
    dto.author = 'authorId'
    const ofImportDTO = plainToInstance(CreateBookDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('author')).toBeFalsy()
  })

  it('year field is not number', async () => {
    dto.year = 'year'
    const ofImportDTO = plainToInstance(CreateBookDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('year')).toBeTruthy()
  })

  it('year field is number', async () => {
    dto.year = 2024
    const ofImportDTO = plainToInstance(CreateBookDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('year')).toBeFalsy()
  })

  it('description field is not string', async () => {
    dto.description = 12
    const ofImportDTO = plainToInstance(CreateBookDto, dto)
    const errors = await validate(ofImportDTO)
    expect(
      errors.map((err) => err.property).includes('description'),
    ).toBeTruthy()
  })

  it('description field is string', async () => {
    dto.description = 'description'
    const ofImportDTO = plainToInstance(CreateBookDto, dto)
    const errors = await validate(ofImportDTO)
    expect(
      errors.map((err) => err.property).includes('description'),
    ).toBeFalsy()
  })

  it('condition field is not number', async () => {
    dto.condition = 'condition'
    const ofImportDTO = plainToInstance(CreateBookDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('condition')).toBeTruthy()
  })

  it('condition field is number', async () => {
    dto.condition = 3
    const ofImportDTO = plainToInstance(CreateBookDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('condition')).toBeFalsy()
  })
})
