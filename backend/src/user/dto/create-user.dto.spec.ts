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
      name: '',
      email: '',
      password: '',
      bio: '',
      avatar: '',
    }
  })

  it('name field is empty', async () => {
    const ofImportDTO = plainToInstance(CreateUserDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('name')).toBeTruthy()
  })

  it('name field is not string', async () => {
    dto.name = numberValue
    const ofImportDTO = plainToInstance(CreateUserDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('name')).toBeTruthy()
  })

  it('name field is correct', async () => {
    dto.name = stringValue
    const ofImportDTO = plainToInstance(CreateUserDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('name')).toBeFalsy()
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

  it('email field is correct', async () => {
    dto.password = stringValue
    const ofImportDTO = plainToInstance(CreateUserDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('password')).toBeFalsy()
  })

  it('bio field is not string', async () => {
    dto.bio = numberValue
    const ofImportDTO = plainToInstance(CreateUserDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('bio')).toBeTruthy()
  })

  it('bio field is string', async () => {
    dto.bio = stringValue
    const ofImportDTO = plainToInstance(CreateUserDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('bio')).toBeFalsy()
  })

  it('avatar field is not string', async () => {
    dto.avatar = numberValue
    const ofImportDTO = plainToInstance(CreateUserDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('avatar')).toBeTruthy()
  })

  it('avatar field is string', async () => {
    dto.avatar = stringValue
    const ofImportDTO = plainToInstance(CreateUserDto, dto)
    const errors = await validate(ofImportDTO)
    expect(errors.map((err) => err.property).includes('avatar')).toBeFalsy()
  })
})
