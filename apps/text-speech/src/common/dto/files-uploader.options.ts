import { FileMimeType } from '../types';

export class FileUploaderLimits {
  fileSize: number;
  files: number;
}

export class FilesUploaderOptions {
  property: string;
  destination?: string = './public/uploads';
  path?: string = '/';
  limits: FileUploaderLimits;
  mimetype?: FileMimeType | Array<FileMimeType>;
}
