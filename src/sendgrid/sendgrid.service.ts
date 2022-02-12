import { BadGatewayException, Inject, Injectable, Logger } from '@nestjs/common';
import { MailDataRequired } from '@sendgrid/helpers/classes/mail';
import { ClientResponse } from '@sendgrid/client/src/response';
import { MailService } from '@sendgrid/mail';

import * as deepmerge from 'deepmerge';

import { SendGridModuleOptions } from './interfaces';

import { SENDGRID_MODULE_OPTIONS } from './sendgrid.constants';

@Injectable()
export class SendGridService extends MailService {
  private readonly logger = new Logger(SendGridService.name);

  private mergeWithDefaultMailData(data: Partial<MailDataRequired>): MailDataRequired {
    if (!this.options.default) return data as MailDataRequired;
    return deepmerge(this.options.default, data);
  }

  constructor(
    @Inject(SENDGRID_MODULE_OPTIONS)
    private readonly options: SendGridModuleOptions,
  ) {
    super();

    if (!options.apiKey) throw new Error('SendGrid API Key not found');
    if (options.timeout) this.setTimeout(options.timeout);
    if (options.substitutionWrappers)
      this.setSubstitutionWrappers(
        options.substitutionWrappers.left,
        options.substitutionWrappers.right,
      );

    this.setApiKey(options.apiKey);
  }

  public async sendMail(
    data: Partial<MailDataRequired>,
  ): Promise<[ClientResponse, Record<string, unknown>]> {
    return this.send(this.mergeWithDefaultMailData(data)).catch(({ response }) => {
      const [error] = response.body.errors;
      this.logger.error(error.message);
      throw new BadGatewayException();
    });
  }

  public async sendMultipleMail(
    data: Partial<MailDataRequired>,
  ): Promise<[ClientResponse, Record<string, unknown>]> {
    return this.sendMultiple(this.mergeWithDefaultMailData(data)).catch(({ response }) => {
      const [error] = response.body.errors;
      this.logger.error(error.message);
      throw new BadGatewayException();
    });
  }
}
