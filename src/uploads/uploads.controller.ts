import {
  Bind,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('sharp')
  @UseInterceptors(
    FilesInterceptor('files', 3, {
      limits: {
        fileSize: 1000000 * 5,
      },
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => {
          return cb(null, file.originalname);
        },
      }),
    }),
  )
  @Bind(UploadedFiles())
  async uploadFile(files: File[]) {
    const result = await this.uploadsService.converter(files);
    return result;
  }
}
