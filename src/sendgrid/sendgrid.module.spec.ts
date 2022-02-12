import { DynamicModule } from '@nestjs/common';
import { expect } from 'chai';
import { spy } from 'sinon';

import { SENDGRID_MODULE_OPTIONS } from './sendgrid.constants';
import { SendGridModule } from './sendgrid.module';

describe('SendGridModule', () => {
  const defaultExpect = (dynamicModule: DynamicModule, include: any, length: number) => {
    expect(dynamicModule.exports).to.include(SENDGRID_MODULE_OPTIONS);
    expect(dynamicModule.providers).to.have.length(length);
    expect(dynamicModule.imports).to.be.undefined;
  };

  describe('register', () => {
    it('should provide an options', () => {
      const options: any = { apiKey: 'test' };
      const dynamicModule = SendGridModule.register(options);
      defaultExpect(dynamicModule, SENDGRID_MODULE_OPTIONS, 3);
      expect(dynamicModule.providers).to.deep.include({
        provide: SENDGRID_MODULE_OPTIONS,
        useValue: options,
      });
    });
  });

  describe('register async', () => {
    describe('useFactory', () => {
      it('should provide an options', () => {
        const options: any = {};
        const asyncOptions = { useFactory: () => options };
        const dynamicModule = SendGridModule.registerAsync(asyncOptions);
        defaultExpect(dynamicModule, SENDGRID_MODULE_OPTIONS, 3);
        expect(dynamicModule.providers).to.deep.include({
          provide: SENDGRID_MODULE_OPTIONS,
          useFactory: asyncOptions.useFactory,
          inject: [],
        });
      });
    });

    describe('useExisting', () => {
      it('should provide an options', () => {
        const asyncOptions: any = { useExisting: Object };
        const dynamicModule = SendGridModule.registerAsync(asyncOptions);
        defaultExpect(dynamicModule, SENDGRID_MODULE_OPTIONS, 3);
      });
    });

    describe('useClass', () => {
      it('should provide an options', () => {
        const asyncOptions: any = { useClass: Object };
        const dynamicModule = SendGridModule.registerAsync(asyncOptions);
        defaultExpect(dynamicModule, SENDGRID_MODULE_OPTIONS, 4);
      });

      it('provider should call "createSendGridOptions"', async () => {
        const asyncOptions: any = { useClass: Object };
        const dynamicModule: any = SendGridModule.registerAsync(asyncOptions);
        const optionsFactory = { createSendGridOptions: spy() };
        await dynamicModule.providers[0].useFactory(optionsFactory);
        expect(optionsFactory.createSendGridOptions.called).to.be.true;
      });
    });
  });
});
