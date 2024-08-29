import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { filesUploaderInterceptor } from '../interceptors/files-uploader.interceptor';
import { FilesUploaderOptions } from '../dto/files-uploader.options';

export function filesUploader(filesUploaderOptions: FilesUploaderOptions) {
  return applyDecorators(
    UseInterceptors(filesUploaderInterceptor(filesUploaderOptions)),
  );
}
