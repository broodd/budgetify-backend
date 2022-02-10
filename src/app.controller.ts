import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  DiskHealthIndicator,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

import { ConfigService } from './config';

/**
 * [description]
 */
@ApiTags('status')
@Controller('status')
export class AppController {
  /**
   * [description]
   * @private
   */
  private readonly path = this.configService.getDest('STORE_DEST');

  /**
   * [description]
   * @param configService
   * @param typeorm
   * @param memory
   * @param health
   * @param disk
   */
  constructor(
    private readonly configService: ConfigService,
    private readonly typeorm: TypeOrmHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly health: HealthCheckService,
    private readonly disk: DiskHealthIndicator,
  ) {}

  /**
   * [description]
   */
  @Get()
  @HealthCheck()
  public status(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.disk.checkStorage('disk', { path: this.path, thresholdPercent: 1 }),
      () => this.memory.checkHeap('memory_heap', 2 ** 30),
      () => this.memory.checkRSS('memory_rss', 2 ** 31),
      () => this.typeorm.pingCheck('database'),
    ]);
  }
}
