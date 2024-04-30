import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

import { UpdateBorrowerDto } from '@src/book/dto/update-borrower.dto'

describe('update-borrower.dto', () => {
  let dto
  const numberValue = 12
  const stringValue = 'string-value'

  beforeAll(() => {
    dto = {
      borrowerId: '',
    }
  })

  it('check throw error if the borrowerId field is not a number', async () => {
    dto.borrowerId = stringValue
    const ofImportDTO = plainToInstance(UpdateBorrowerDto, dto)
    const errors = await validate(ofImportDTO)
    expect(
      errors.map((err) => err.property).includes('borrowerId'),
    ).toBeTruthy()
  })

  it('borrowerId field is null', async () => {
    dto.borrowerId = null
    const ofImportDTO = plainToInstance(UpdateBorrowerDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('borrowerId')).toBeFalsy()
  })

  it('borrowerId field is number', async () => {
    dto.borrowerId = numberValue
    const ofImportDTO = plainToInstance(UpdateBorrowerDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('borrowerId')).toBeFalsy()
  })
})
