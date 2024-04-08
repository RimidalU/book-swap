import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

import { CreateTagDto } from '@src/tag/dto/create-tag.dto'

describe('create-tag.dto', () => {
  let dto
  beforeAll(() => {
    dto = {
      name: '',
    }
  })

  it('name field is empty', async () => {
    const ofImportDTO = plainToInstance(CreateTagDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('name')).toBeTruthy()
  })

  it('name field is not string', async () => {
    dto.name = 12
    const ofImportDTO = plainToInstance(CreateTagDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('name')).toBeTruthy()
  })

  it('name field is correct', async () => {
    dto.name = 'Name'
    const ofImportDTO = plainToInstance(CreateTagDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('name')).toBeFalsy()
  })
})
