import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CurrencyEnum } from 'src/common/enums';

export class CurrencyBaseParamDto {
  @ApiProperty()
  @IsEnum(CurrencyEnum)
  public readonly base: CurrencyEnum;
}
