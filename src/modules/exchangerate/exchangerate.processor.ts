import { Processor, Process, OnQueueFailed } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import { ExchangeRateService } from './exchangerate.service';
import { ExchangeRateProcessorEnum } from './enums';
import { EXCHANGERATE_QUEUE } from './constants';

@Processor(EXCHANGERATE_QUEUE)
export class ExchangeRateProcessor {
  private readonly logger = new Logger(ExchangeRateProcessor.name);

  constructor(private readonly exchangeRateService: ExchangeRateService) {}

  @OnQueueFailed()
  public onQueueFailed(job: Job, err: Error): void {
    this.logger.error(`${job.id} failed, ${err}`);
  }

  @Process(ExchangeRateProcessorEnum.UPDATE_CURRENCY_RATES)
  public async updateCurrencyRates(): Promise<void> {
    return this.exchangeRateService.selectFromApiAndSaveToCache();
  }
}
