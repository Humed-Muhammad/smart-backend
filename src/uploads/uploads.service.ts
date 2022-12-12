import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import fs from 'fs';
@Injectable()
export class UploadsService {
  // Find the user in db
  async converter(files: any[]) {
    const convertedImages: { image: string; name: string }[] = [];

    const outputFolderName = './public/uploads';
    const formatFileExtension = (
      imageName: string,
      imageType: string,
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
          .toFormat('png')
          .toFile(
            outputFolderName +
              `/${file.filename.slice(
                0,
                file.filename.lastIndexOf('.'),
              )}.${'png'}`,
          )
          .then(() => {
            convertedImages.push({
              image: fs.readFileSync(
                formatFileExtension(file.filename, 'png'),
                {
                  encoding: 'base64',
                },
              ),
              name: formatFileExtension(file.filename, 'png', false),
            });
            fs.rmSync(outputFolderName + `/${file.filename}`);
            fs.rmSync(formatFileExtension(file.filename, 'png'));
          });
      }

      console.log(convertedImages);
      return convertedImages;
    } catch (e) {
      console.log(e);
    }
  }
}
