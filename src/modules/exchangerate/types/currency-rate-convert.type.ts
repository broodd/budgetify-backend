import { CurrencyEnum } from 'src/common/enums';

export type CurrencyRateConvert = {
  amount: number;
  base: CurrencyEnum;
  currency: CurrencyEnum;
};
