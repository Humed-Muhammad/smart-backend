import { Injectable } from '@nestjs/common';
import sharp, { AvailableFormatInfo, FormatEnum } from 'sharp';
import fs from 'fs';
import { IHtmlToImageOptions } from 'src/utils/types';
import { InjectBrowser } from 'nest-puppeteer';
import { Browser } from 'puppeteer';
import { bufferToB64 } from 'src/utils';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class UploadsService {
  constructor(@InjectBrowser() private readonly browser: Browser) {}
  // Find the user in db
  async converter(files: any[], type: keyof FormatEnum | AvailableFormatInfo) {
    const convertedImages: { image: string; name: string; size: number }[] = [];

    const outputFolderName = './public/converter';
    const formatFileExtension = (
      imageName: string,
      imageType: keyof FormatEnum | AvailableFormatInfo,
      withDire = true,
    ) => {
      let name = '';
      if (withDire) {
        name =
          outputFolderName +
          `/${imageName.slice(0, imageName.lastIndexOf('.'))}.${imageType}`;
      } else {
        name = `${imageName.slice(0, imageName.lastIndexOf('.'))}.${imageType}`;
      }

      return name;
    };
    try {
      for (const file of files) {
        await sharp(`${outputFolderName}/${file.filename}`)
          .toFormat(type)
          .toFile(
            outputFolderName +
              `/${file.filename.slice(
                0,
                file.filename.lastIndexOf('.'),
              )}.${type}`,
          )
          .then((value) => {
            convertedImages.push({
              image: fs.readFileSync(formatFileExtension(file.filename, type), {
                encoding: 'base64',
              }),
              name: formatFileExtension(file.filename, type, false),
              size: value.size,
            });
            fs.rmSync(outputFolderName + `/${file.filename}`);
            fs.rmSync(formatFileExtension(file.filename, type));
          })
          .catch(() => {
            fs.rmSync(outputFolderName + `/${file.filename}`);
            fs.rmSync(formatFileExtension(file.filename, type));
            throw new Error('There is an error during conversion!.');
          });
      }
      return convertedImages;
    } catch (err) {
      throw new Error(err);
    }
  }
  async resize(files: any[], width: number, height: number) {
    const sharpResizeOutPut = './public/resize';
    const resizedImages: { image: string; name: string; size: number }[] = [];
    try {
      for (const file of files) {
        await sharp(`${sharpResizeOutPut}/${file.filename}`)
          .resize(Number(width), Number(height), {
            fit: 'contain',
          })
          .toFile(sharpResizeOutPut + file.originalname)
          .then((value) => {
            resizedImages.push({
              image: fs.readFileSync(sharpResizeOutPut + file.originalname, {
                encoding: 'base64',
              }),
              name: file.originalname,
              size: value.size,
            });
            fs.rmSync(sharpResizeOutPut + `/${file.filename}`);
            fs.rmSync(sharpResizeOutPut + file.originalname);
          })
          .catch(() => {
            fs.rmSync(sharpResizeOutPut + `/${file.filename}`);
            fs.rmSync(sharpResizeOutPut + file.originalname);
            throw new Error('Unsupported image');
          });
      }

      return resizedImages;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
  async htmlToImageConverter(options: IHtmlToImageOptions) {
    try {
      const page = await this.browser.newPage();
      await page.setViewport({
        width: Number(options.screenshotSize),
        height: 1080,
      });
      await page.goto(options.url);
      const content = await page.screenshot({
        type: options.imageType,
        omitBackground: true,
      });

      await page.close();

      const image = bufferToB64({
        buffer: content,
        imageType: options.imageType,
      });

      return {
        image,
        imageType: options.imageType,
        name: `${uuid4()}.${options.imageType}`,
        id: uuid4(),
      };
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}
