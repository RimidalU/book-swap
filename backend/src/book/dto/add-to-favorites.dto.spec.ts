import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

import { AddToFavoritesDto } from '@src/book/dto/add-to-favorites.dto'

describe('add-to-favorites.dto', () => {
  let dto
  beforeAll(() => {
    dto = {
      id: '',
    }
  })

  it('id field is empty', async () => {
    const ofImportDTO = plainToInstance(AddToFavoritesDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('id')).toBeTruthy()
  })

  it('id field is not number', async () => {
    dto.id = 'string'
    const ofImportDTO = plainToInstance(AddToFavoritesDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('id')).toBeTruthy()
  })

  it('id field is correct', async () => {
    dto.id = 12
    const ofImportDTO = plainToInstance(AddToFavoritesDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('id')).toBeFalsy()
  })
})
