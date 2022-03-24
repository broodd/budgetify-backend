import { CurrencyEnum } from 'src/common/enums';

export type CurrencyRateCacheRecord = {
  [base in CurrencyEnum]?: Record<CurrencyEnum, number>;
};

export type CurrencyRateCache = {
  base: CurrencyEnum;
  rates: Record<CurrencyEnum, number>;
};

export type CurrencyRateApi = {
  base: CurrencyEnum;
  date: string;
  rates: Record<CurrencyEnum, number>;
};
