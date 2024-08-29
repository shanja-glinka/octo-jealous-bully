import { ArgumentMetadata, Injectable, ValidationPipe } from '@nestjs/common';

@Injectable()
export class TrimValidationPipe extends ValidationPipe {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value === 'object' && value !== null) {
      this.stripWhitespace(value);
    }

    return super.transform(value, metadata);
  }

  private stripWhitespace(obj: any) {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].trim();
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        this.stripWhitespace(obj[key]);
      }
    }
  }
}
