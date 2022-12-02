import { imageFileFilter, imageFilesFilter } from '../exceptions/file-mimetype.filter';
import { ApiFile, ApiFiles } from './file.decorator';

//* 단일 파일
export const ApiImageFile = (dirName: string) => {
  return ApiFile(dirName, imageFileFilter);
};

//* 다중 파일
export const ApiImageFiles = (dirName: string) => {
  return ApiFiles(dirName, imageFilesFilter);
};
