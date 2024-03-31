import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

import { CreateUserDto } from '@src/user/dto/create-user.dto'

describe('create-user.dto', () => {
  let dto
  const numberValue = 12
  const stringValue = 'string-value'
  const emailValue = 'user@email.com'

  beforeAll(() => {
    dto = {
      email: '',
      password: '',
    }
  })

  it('password field is empty', async () => {
    const ofImportDTO = plainToInstance(CreateUserDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('password')).toBeTruthy()
  })

  it('password field is not a string', async () => {
    dto.password = numberValue
    const ofImportDTO = plainToInstance(CreateUserDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('password')).toBeTruthy()
  })

  it('password field is correct', async () => {
    dto.password = stringValue
    const ofImportDTO = plainToInstance(CreateUserDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('password')).toBeFalsy()
  })

  it('email field is empty', async () => {
    const ofImportDTO = plainToInstance(CreateUserDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('email')).toBeTruthy()
  })

  it('email field is not a email', async () => {
    dto.email = stringValue
    const ofImportDTO = plainToInstance(CreateUserDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('email')).toBeTruthy()
  })

  it('email field is correct', async () => {
    dto.email = emailValue
    const ofImportDTO = plainToInstance(CreateUserDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('email')).toBeFalsy()
  })
})
