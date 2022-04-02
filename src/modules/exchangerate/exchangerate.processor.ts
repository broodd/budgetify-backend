import { Processor, Process, OnQueueFailed, OnQueueCompleted } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import { ExchangeRateService } from './exchangerate.service';
import { ExchangeRateProcessorEnum } from './enums';
import { EXCHANGERATE_QUEUE } from './constants';

@Processor(EXCHANGERATE_QUEUE)
export class ExchangeRateProcessor {
  private readonly logger = new Logger(ExchangeRateProcessor.name);

  constructor(private readonly exchangeRateService: ExchangeRateService) {}

  @OnQueueCompleted()
  public onQueueCompleted(job: Job, result: any): void {
    this.logger.verbose('OnQueueCompleted', job.id, result);
  }

  @OnQueueFailed()
  public onQueueFailed(job: Job, err: Error): void {
    this.logger.error('OnQueueFailed', job.id, err);
  }

  @Process(ExchangeRateProcessorEnum.UPDATE_CURRENCY_RATES)
  public async updateCurrencyRates(): Promise<void> {
    return this.exchangeRateService.selectFromApiAndSaveToCache();
  }
}
