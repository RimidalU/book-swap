export const fileMock = {
  fieldname: 'file',
  encoding: '7bit',
  originalname: 'file.jpeg',
  mimetype: 'image/jpeg',
  path: 'something',
  buffer: Buffer.from('Buffer'),
  size: 51828,
  filename: 'file-name',
  destination: 'destination-path',
} as Express.Multer.File

export const dbFileMock = {
  id: 33,
  name: 'file.jpeg',
  url: '/file.jpeg',
  mimetype: 'image/jpeg',
  data: Buffer.from('Buffer'),
}
