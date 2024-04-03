import { ApiProperty } from '@nestjs/swagger'

export class LoginResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsIm5hbWUiOiJEb24gRG91IiwiZW1haWwiOiJkb24tZG91QGVtYWlsLmNvbSIsImlhdCI6MTcxMjE1NDY0OSwiZXhwIjoxNzEyMzI3NDQ5fQ.mj1AnniSLsBMKeIe4-Q10AEJaGroGzHGUWWQhXv0xK0',
    description: 'Access Token',
  })
  readonly access_token: string
}
