import { BadRequestException } from '@nestjs/common';
import { rm } from '../constants';

export const multerOptions = {
  fileFilter: (req, file, cb: any) => {
    file.mimetype.startsWith('image') ? cb(null, true) : cb(new BadRequestException(rm.NO_IMAGE_TYPE), false);
  },
};
