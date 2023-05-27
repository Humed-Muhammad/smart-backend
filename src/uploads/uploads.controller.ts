import {
  Bind,
  Controller,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { UploadsService } from './uploads.service';

@Controller('service')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}
  @Post('htmlToImage')
  async htmlToImage(@Req() req: Request) {
    const result = await this.uploadsService.htmlToImageConverter(req.body);

    return result;
  }

  @Post('converter')
  @UseInterceptors(
    FilesInterceptor('files', 3, {
      limits: {
        fileSize: 10000000 * 5,
      },
      storage: diskStorage({
        destination: './public/converter',
        filename: (_, file, cb) => {
          return cb(null, file.originalname);
        },
      }),
    }),
  )
  @Bind(UploadedFiles())
  async converter(files: File[], @Req() req: Request) {
    const result = await this.uploadsService.converter(files, req.body['type']);
    if (result) {
      return result;
    } else {
      throw new Error('Not');
    }
  }

  @Post('resize')
  @UseInterceptors(
    FilesInterceptor('files', 3, {
      limits: {
        fileSize: 10000000 * 5,
      },
      storage: diskStorage({
        destination: './public/resize',
        filename: (_, file, cb) => {
          return cb(null, file.originalname);
        },
      }),
    }),
  )
  @Bind(UploadedFiles())
  async resize(files: File[], @Req() req: Request) {
    const result = await this.uploadsService.resize(
      files,
      req.body['width'],
      req.body['height'],
    );
    if (result) {
      return result;
    } else {
      throw new Error('Not');
    }
  }
}
