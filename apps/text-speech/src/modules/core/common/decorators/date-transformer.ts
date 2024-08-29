import { Transform } from 'class-transformer';
import { isDate, isString } from 'class-validator';

export function transformDate(format = 'YYYY-MM-DDTHH:mm:ssZ') {
  return Transform(({ value }) => {
    if (isDate(value)) {
      return value.toISOString();
    }
    if (isString(value)) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toISOString();
      }
    }
    return value;
  });
}
