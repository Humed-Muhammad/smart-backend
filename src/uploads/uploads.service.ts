import { Injectable } from '@nestjs/common';
import sharp, { AvailableFormatInfo, FormatEnum } from 'sharp';
import fs from 'fs';
@Injectable()
export class UploadsService {
  // Find the user in db
  async converter(files: any[], type: keyof FormatEnum | AvailableFormatInfo) {
    const convertedImages: { image: string; name: string }[] = [];

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
          .then(() => {
            convertedImages.push({
              image: fs.readFileSync(formatFileExtension(file.filename, type), {
                encoding: 'base64',
              }),
              name: formatFileExtension(file.filename, type, false),
            });
            fs.rmSync(outputFolderName + `/${file.filename}`);
            fs.rmSync(formatFileExtension(file.filename, type));
          })
          .catch(() => {
            fs.rmSync(outputFolderName + `/${file.filename}`);
            fs.rmSync(formatFileExtension(file.filename, type));
            throw new Error('Unsupported image');
          });
      }
      return convertedImages;
    } catch (err) {
      throw new Error('Unsupported image');
    }
  }
  async resize(files: any[], width: number, height: number) {
    const sharpResizeOutPut = './public/resize';
    const resizedImages: { image: string; name: string }[] = [];
    try {
      for (const file of files) {
        await sharp(`${sharpResizeOutPut}/${file.filename}`)
          .resize(Number(width), Number(height))
          .toFile(sharpResizeOutPut + file.originalname)
          .then(() => {
            resizedImages.push({
              image: fs.readFileSync(sharpResizeOutPut + file.originalname, {
                encoding: 'base64',
              }),
              name: file.originalname,
            });
            fs.rmSync(sharpResizeOutPut + `/${file.filename}`);
            fs.rmSync(sharpResizeOutPut + file.originalname);
          });
      }

      return resizedImages;
    } catch (error) {
      console.log(error);
    }
  }
}
