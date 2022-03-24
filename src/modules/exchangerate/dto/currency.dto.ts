import { ApiProperty } from '@nestjs/swagger';
import { CurrencyEnum } from 'src/common/enums';

export class CurrencyRateDto {
  @ApiProperty()
  base: CurrencyEnum;

  @ApiProperty()
  rates: Record<CurrencyEnum, number>;
}
