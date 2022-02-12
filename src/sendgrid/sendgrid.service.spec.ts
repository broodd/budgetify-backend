import { Test, TestingModule } from '@nestjs/testing';
import { BadGatewayException } from '@nestjs/common';

import { SENDGRID_MODULE_OPTIONS } from './sendgrid.constants';
import { SendGridService } from './sendgrid.service';
import { SendGridModuleOptions } from './interfaces';

describe('SendGridService', () => {
  let service: SendGridService;
  const error = new BadGatewayException();
  const options: SendGridModuleOptions = {
    apiKey: 'SG.',
    timeout: 3000,
    default: { from: 'test' },
    substitutionWrappers: { left: '{{', right: '}}' },
  };

  describe('defined', () => {
    it('should be defined with required options', async () => {
      const received = new SendGridService({ apiKey: options.apiKey });
      expect(received).toBeDefined();
    });

    it('should be defined with all options', async () => {
      const received = new SendGridService(options);
      expect(received).toBeDefined();
    });

    it('should be return apiKey error', async () => {
      const error = new Error('SendGrid API Key not found');
      try {
        new SendGridService({ apiKey: null });
      } catch (received) {
        expect(received).toBeInstanceOf(Error);
        expect(received).toStrictEqual(error);
      }
    });
  });

  describe('mergeWithDefaultMailData', () => {
    it('should be merge data before send', async () => {
      const mock = new SendGridService(options);
      jest.spyOn(mock, 'send').mockImplementationOnce(async (data) => [data as any, {}]);
      const received = await mock.sendMail({});
      expect(received).toStrictEqual([{ ...options.default }, {}]);
    });

    it('should be return original payload', async () => {
      const mock = new SendGridService({ apiKey: options.apiKey });
      jest.spyOn(mock, 'send').mockImplementationOnce(async (data) => [data as any, {}]);
      const received = await mock.sendMail({});
      expect(received).toStrictEqual([{}, {}]);
    });
  });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendGridService,
        {
          provide: SENDGRID_MODULE_OPTIONS,
          useValue: options,
        },
      ],
    }).compile();

    service = module.get<SendGridService>(SendGridService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendMail', () => {
    it('should be send email', async () => {
      jest.spyOn(service, 'send').mockImplementationOnce(async (data) => [data as any, {}]);
      const received = await service.sendMail({});
      expect(received).toStrictEqual([{ ...options.default }, {}]);
    });

    it('should be return error', async () => {
      jest.spyOn(service, 'send').mockImplementationOnce(async () => {
        return Promise.reject({ response: { body: { errors: [{ message: 'test' }] } } });
      });

      await service.sendMail({}).catch((received) => {
        expect(received).toBeInstanceOf(BadGatewayException);
        expect(received).toStrictEqual(error);
      });
    });
  });

  describe('sendMultipleMail', () => {
    it('should be send emails', async () => {
      jest.spyOn(service, 'sendMultiple').mockImplementationOnce(async (data) => [data as any, {}]);
      const received = await service.sendMultipleMail({});
      expect(received).toStrictEqual([{ ...options.default }, {}]);
    });

    it('should be return error', async () => {
      jest.spyOn(service, 'sendMultiple').mockImplementationOnce(async () => {
        return Promise.reject({ response: { body: { errors: [{ message: 'test' }] } } });
      });

      await service.sendMultipleMail({}).catch((received) => {
        expect(received).toBeInstanceOf(BadGatewayException);
        expect(received).toStrictEqual(error);
      });
    });
  });
});
