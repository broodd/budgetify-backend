import { floatToInt } from 'src/common/helpers';
import { ValueTransformer } from 'typeorm';

export const FloatIntColumnTransformer: ValueTransformer = {
  to: (value: number): number => value && floatToInt(value),
  from: (value: number) => value / 100,
};
