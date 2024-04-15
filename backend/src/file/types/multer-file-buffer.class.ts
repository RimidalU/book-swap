export class MulterFileBufferClass{
  originalname: string;
  buffer: Buffer;

  constructor(file: Express.Multer.File | MulterFileBufferClass) {
    this.originalname = file.originalname
    this.buffer = file.buffer
  }
}