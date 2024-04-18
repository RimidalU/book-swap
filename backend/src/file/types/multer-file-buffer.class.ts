export class MulterFileBufferClass {
  originalname: string
  filename: string
  buffer: Buffer

  constructor(file: Express.Multer.File | MulterFileBufferClass) {
    this.originalname = file.originalname
    this.filename = `${file.filename}.${file.originalname.split('.').pop()}`
    this.buffer = file.buffer
  }
}
