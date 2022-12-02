import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import multerS3 from 'multer-s3-transform';
import { nanoid } from 'nanoid';
import path from 'path';
import sharp from 'sharp';
import { ApiConfigService } from './api-config.service';

@Injectable()
export class AwsS3Service {
  constructor(private readonly config: ApiConfigService) {}

  private s3() {
    return new AWS.S3({
      accessKeyId: this.config.awsS3Config.bucketAccessKey,
      secretAccessKey: this.config.awsS3Config.bucketSecretKey,
      region: this.config.awsS3Config.bucketRegion,
    });
  }

  storage(dirName: string, type?: string) {
    return multerS3({
      s3: this.s3(),
      bucket: this.config.awsS3Config.bucket,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      shouldTransform: true,
      transforms: [
        {
          id: 'resized',
          key: (req: Express.Request, file: Express.MulterS3.File, cb: any) => {
            const extension = path.extname(file.originalname);
            !type
              ? cb(null, `images/${dirName}/${Date.now()}_${nanoid()}${extension}`)
              : cb(null, `images/${dirName}/${file.originalname}`);
          },
          transform: (req: Express.Request, file: Express.MulterS3.File, cb: any) => {
            dirName === 'profile'
              ? cb(null, sharp().webp().resize(300, 300))
              : cb(null, sharp().webp().resize(800, 800));
          },
        },
      ],
    });
  }

  upload(file: Express.Multer.File, dirName: string, buffer: any) {
    const s3 = this.s3();
    const extension = path.extname(file.originalname);

    const params = {
      Bucket: this.config.awsS3Config.bucket,
      Key: `images/${dirName}/${Date.now()}_${nanoid()}${extension}`,
      Body: sharp(buffer),
      ContentType: 'image/png',
    };

    const location = new Promise((resolve, reject) => {
      s3.upload(params, (error: any, data: any) => {
        if (error) {
          reject(error.message);
        }
        resolve(data);
      });
    }).then((value: any) => {
      return value.Location;
    });

    return location;
  }
}
