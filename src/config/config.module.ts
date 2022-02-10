import { Module, Global } from '@nestjs/common';

import { ConfigService } from './config.service';

/**
 * [description]
 */
@Global()
@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
