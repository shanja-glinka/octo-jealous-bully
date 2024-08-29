import { Transform } from 'class-transformer';

export function transformBoolean() {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      value = value.toLowerCase();
    }
    if (value === 'true' || value === '1' || value === 1 || value === true) {
      value = true;
    } else if (
      value === 'false' ||
      value === '0' ||
      value === 0 ||
      value === false
    ) {
      value = false;
    } else {
      value = Boolean(value);
    }
    return value;
  });
}
