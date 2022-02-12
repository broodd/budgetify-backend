import { MailDataRequired } from '@sendgrid/helpers/classes/mail';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Type } from '@nestjs/common';

export interface SendGridModuleOptions {
  apiKey: string;
  timeout?: number;
  substitutionWrappers?: { left: string; right: string };
  default?: Partial<MailDataRequired>;
}

export interface SendGridOptionsFactory {
  createSendGridOptions(): Promise<SendGridModuleOptions> | SendGridModuleOptions;
}

export interface SendGridModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<SendGridOptionsFactory>;
  useClass?: Type<SendGridOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<SendGridModuleOptions> | SendGridModuleOptions;
  inject?: any[];
}
