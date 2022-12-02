import { Transform } from 'class-transformer';

export const TransformEmptyToNull = () => {
  return Transform(({ value }) => (value.trim() === '' ? null : value.trim()));
};
