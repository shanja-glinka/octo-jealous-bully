import {
  Injectable,
  mixin,
  NestInterceptor,
  Type,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FilesUploaderOptions } from '../dto/files-uploader.options';

export function filesUploaderInterceptor(
  options: FilesUploaderOptions,
): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    fileInterceptor: NestInterceptor;

    constructor() {
      const filesDestination =
        options.destination.slice(-1) == '/'
          ? options.destination
          : options.destination + '/';

      const filesPath =
        typeof options.path === 'string' &&
        options.path.length > 0 &&
        options.path[0] == '/'
          ? options.path.substring(1)
          : options.path;

      const multerOptions: MulterOptions = {
        storage: diskStorage({
          destination: `${filesDestination}${filesPath}`,
          filename: (req, file, cb) => {
            const randomName = uuidv4();

            cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
      };

      if (options.limits) {
        multerOptions.limits = options.limits;
      }

      if (options.mimetype) {
        if (!Array.isArray(options.mimetype)) {
          options.mimetype = [options.mimetype];
        }

        const mimetypes = options.mimetype as Array<string>;

        multerOptions.fileFilter = (req: any, file: any, cb) => {
          if (
            mimetypes.some((memofind) => file.mimetype.includes(memofind)) ===
            false
          )
            return cb(
              new UnsupportedMediaTypeException('Unsupported mime type'),
              false,
            );

          cb(null, true);
        };
      }

      this.fileInterceptor =
        typeof options.limits !== 'undefined' && options.limits.files > 1
          ? new (AnyFilesInterceptor(multerOptions))()
          : new (FileInterceptor(options.property, multerOptions))();
    }

    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      // Hook to re-set request-data
      const res = this.fileInterceptor.intercept(...args);

      // Hook apply

      return res;
    }
  }
  return mixin(Interceptor);
}
