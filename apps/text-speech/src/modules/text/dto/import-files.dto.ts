import { format } from 'date-fns';
import { FilesUploaderOptions } from '../../core/common/dto/files-uploader.options';
import { DateFnsFormatConstant } from '../../core/constants';

export const ImportFileDto = {
  property: 'file',
  destination: './public/uploads/texts',
  path: format(new Date(), DateFnsFormatConstant),
  limits: {
    files: 1,
    fileSize: 1e13, //10MB
  },
  mimetype: 'application',
} as FilesUploaderOptions;
