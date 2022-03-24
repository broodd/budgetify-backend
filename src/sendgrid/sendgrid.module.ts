import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { Module, DynamicModule, Provider, Global } from '@nestjs/common';

import { SENDGRID_MODULE_OPTIONS, SENDGRID_MODULE } from './sendgrid.constants';
import { SendGridService } from './sendgrid.service';
import {
  SendGridModuleAsyncOptions,
  SendGridOptionsFactory,
  SendGridModuleOptions,
} from './interfaces';

@Global()
@Module({})
export class SendGridModule {
  /**
   * [register description]
   * @param  options [description]
   * @return         [description]
   */
  static register(options?: SendGridModuleOptions): DynamicModule {
    return {
      module: SendGridModule,
      providers: [
        { provide: SENDGRID_MODULE, useValue: randomStringGenerator() },
        { provide: SENDGRID_MODULE_OPTIONS, useValue: options },
        { provide: SendGridService, useClass: SendGridService },
      ],
      exports: [SENDGRID_MODULE, SENDGRID_MODULE_OPTIONS, SendGridService],
    };
  }

  /**
   * [registerAsync description]
   * @param  options [description]
   * @return         [description]
   */
  public static registerAsync(options: SendGridModuleAsyncOptions): DynamicModule {
    return {
      module: SendGridModule,
      imports: options.imports,
      providers: [
        ...this.createAsyncProviders(options),
        { provide: SENDGRID_MODULE, useValue: randomStringGenerator() },
        { provide: SendGridService, useClass: SendGridService },
      ],
      exports: [SENDGRID_MODULE, SENDGRID_MODULE_OPTIONS, SendGridService],
    };
  }

  /**
   * [createAsyncProviders description]
   * @param  options [description]
   * @return         [description]
   */
  private static createAsyncProviders(options: SendGridModuleAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  /**
   * [createAsyncOptionsProvider description]
   * @param  options [description]
   * @return         [description]
   */
  private static createAsyncOptionsProvider(options: SendGridModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: SENDGRID_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: SENDGRID_MODULE_OPTIONS,
      useFactory: async (optionsFactory: SendGridOptionsFactory) =>
        optionsFactory.createSendGridOptions(),
      inject: [options.useExisting || options.useClass],
    };
  }
}
