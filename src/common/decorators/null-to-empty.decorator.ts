import { Transform } from 'class-transformer';

export const TransformNullToEmpty = () => {
  return Transform(({ value }) => (value ? value : []));
};
