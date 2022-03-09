import { Transport, RedisOptions } from '@nestjs/microservices';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  DiskHealthIndicator,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
  MicroserviceHealthIndicator,
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
    private readonly microservice: MicroserviceHealthIndicator,
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
      () =>
        this.microservice.pingCheck<RedisOptions>('redis', {
          transport: Transport.REDIS,
          options: Object.assign(
            {
              host: this.configService.get<string>('REDIS_HOST'),
              port: this.configService.get<number>('REDIS_PORT'),
            },
            this.configService.get('REDIS_TLS') && {
              auth_pass: this.configService.get<string>('REDIS_PASSWORD'),
              tls: { rejectUnauthorized: false },
            },
          ),
        }),
    ]);
  }
}
