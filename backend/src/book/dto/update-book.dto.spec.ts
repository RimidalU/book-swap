import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

import { UpdateBookDto } from '@src/book/dto/update-book.dto'
import { CreateBookDto } from '@src/book/dto/create-book.dto'

describe('update-book.dto', () => {
  let dto
  const numberValue = 12
  const stringValue = 'string-value'

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

  it('check throw error if the name field is not a string', async () => {
    dto.name = numberValue
    const ofImportDTO = plainToInstance(UpdateBookDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('name')).toBeTruthy()
  })

  it('name field is string', async () => {
    dto.name = stringValue
    const ofImportDTO = plainToInstance(UpdateBookDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('name')).toBeFalsy()
  })

  it('check throw error if the author field is not a string', async () => {
    dto.author = numberValue
    const ofImportDTO = plainToInstance(UpdateBookDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('author')).toBeTruthy()
  })
  it('author field is not string', async () => {
    dto.author = stringValue
    const ofImportDTO = plainToInstance(UpdateBookDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('author')).toBeFalsy()
  })

  it('check throw error if the year field is not a number', async () => {
    dto.year = stringValue
    const ofImportDTO = plainToInstance(UpdateBookDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('year')).toBeTruthy()
  })

  it('year field is number', async () => {
    dto.year = numberValue
    const ofImportDTO = plainToInstance(UpdateBookDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('year')).toBeFalsy()
  })

  it('check throw error if the description field is not a string', async () => {
    dto.description = numberValue
    const ofImportDTO = plainToInstance(UpdateBookDto, dto)
    const errors = await validate(ofImportDTO)
    expect(
      errors.map((err) => err.property).includes('description'),
    ).toBeTruthy()
  })

  it('description field is string', async () => {
    dto.description = stringValue
    const ofImportDTO = plainToInstance(UpdateBookDto, dto)
    const errors = await validate(ofImportDTO)
    expect(
      errors.map((err) => err.property).includes('description'),
    ).toBeFalsy()
  })

  it('check throw error if the condition field is not a number', async () => {
    dto.condition = stringValue
    const ofImportDTO = plainToInstance(UpdateBookDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('condition')).toBeTruthy()
  })

  it('condition field is number', async () => {
    dto.condition = numberValue
    const ofImportDTO = plainToInstance(UpdateBookDto, dto)
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
