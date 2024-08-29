import { Transform } from 'class-transformer';

export function transformToNullIfUndefined() {
  return Transform(({ value }) => (value === undefined ? null : value));
}
