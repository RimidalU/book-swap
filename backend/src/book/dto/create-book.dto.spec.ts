import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

import { CreateBookDto } from '@src/book/dto/create-book.dto'

describe('create-book.dto', () => {
  const numberValue = 12
  const stringValue = 'string-value'
  let dto

  beforeAll(() => {
    dto = {
      name: '',
      author: '',
      year: '',
      description: '',
      condition: '',
      tags: [],
    }
  })

  it('name field is empty', async () => {
    const ofImportDTO = plainToInstance(CreateBookDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('name')).toBeTruthy()
  })

  it('name field is not string', async () => {
    dto.name = numberValue
    const ofImportDTO = plainToInstance(CreateBookDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('name')).toBeTruthy()
  })

  it('name field is correct', async () => {
    dto.name = stringValue
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
    dto.author = numberValue
    const ofImportDTO = plainToInstance(CreateBookDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('author')).toBeTruthy()
  })

  it('author field is correct', async () => {
    dto.author = stringValue
    const ofImportDTO = plainToInstance(CreateBookDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('author')).toBeFalsy()
  })

  it('year field is not number', async () => {
    dto.year = stringValue
    const ofImportDTO = plainToInstance(CreateBookDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('year')).toBeTruthy()
  })

  it('year field is number', async () => {
    dto.year = numberValue
    const ofImportDTO = plainToInstance(CreateBookDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('year')).toBeFalsy()
  })

  it('description field is not string', async () => {
    dto.description = numberValue
    const ofImportDTO = plainToInstance(CreateBookDto, dto)
    const errors = await validate(ofImportDTO)
    expect(
      errors.map((err) => err.property).includes('description'),
    ).toBeTruthy()
  })

  it('description field is string', async () => {
    dto.description = stringValue
    const ofImportDTO = plainToInstance(CreateBookDto, dto)
    const errors = await validate(ofImportDTO)
    expect(
      errors.map((err) => err.property).includes('description'),
    ).toBeFalsy()
  })

  it('condition field is not number', async () => {
    dto.condition = stringValue
    const ofImportDTO = plainToInstance(CreateBookDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('condition')).toBeTruthy()
  })

  it('condition field is number', async () => {
    dto.condition = numberValue
    const ofImportDTO = plainToInstance(CreateBookDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('condition')).toBeFalsy()
  })

  it('Each element in tags field is not string', async () => {
    dto.tags = [stringValue, numberValue]
    const ofImportDTO = plainToInstance(CreateBookDto, dto)
    const errors = await validate(ofImportDTO)
    expect(dto.tags.length).not.toBe(0)
    expect(errors.map((err) => err.property).includes('tags')).toBeTruthy()
  })

  it('Each element in tags field is empty', async () => {
    dto.tags = []
    const ofImportDTO = plainToInstance(CreateBookDto, dto)
    const errors = await validate(ofImportDTO)
    expect(dto.tags.length).toBe(0)
    expect(errors.map((err) => err.property).includes('tags')).toBeFalsy()
  })

  it('Each element in tags field is string', async () => {
    dto.tags = [stringValue, stringValue]
    const ofImportDTO = plainToInstance(CreateBookDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('tags')).toBeFalsy()
  })
})
