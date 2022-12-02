import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { ApiConfigService } from 'src/config/services/api-config.service';
import { AwsS3Service } from 'src/config/services/aws-s3.service';

const config = new ApiConfigService(new ConfigService());
const awsS3Service = new AwsS3Service(config);

const MAX_COUNT = 999;

//* 단일 파일
export const ApiFile = (
  dirName: string,
  fileFilter: (req: Express.Request, file: Express.MulterS3.File, cb: any) => void,
) => {
  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    UseInterceptors(FileInterceptor('file', { storage: awsS3Service.storage(dirName), fileFilter })),
  );
};

//* 다중 파일
export const ApiFiles = (
  dirName: string,
  fileFilter: (req: Express.Request, file: Express.MulterS3.File, cb: any) => void,
) => {
  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    UseInterceptors(
      FilesInterceptor('files', MAX_COUNT, { storage: awsS3Service.storage(dirName, 'upload'), fileFilter }),
    ),
  );
};
