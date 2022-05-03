import { HttpStatus, NotFoundException } from '@nestjs/common';
import { ErrorTypeEnum } from '../enums';

import { AllExceptionFilter } from './all-exception.filter';

describe('AllExceptionFilter', () => {
  let filter: AllExceptionFilter;

  const context: any = {
    switchToHttp: jest.fn(() => ({
      getResponse: () => ({
        status() {
          return this;
        },
        send(data: any) {
          return data;
        },
      }),
      getRequest: () => ({
        url: '',
      }),
    })),
  };

  beforeAll(() => {
    filter = new AllExceptionFilter();
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should return an error in specified format', () => {
    const exception = new NotFoundException();
    const { message, statusCode, error } = exception.getResponse() as Record<string, any>;
    const received = filter.catch(exception, context);
    expect(received).toEqual({ error, statusCode, message: [].concat(message) });
  });

  it('should return an internal server error ', () => {
    const exception = new Error();
    const received = filter.catch(exception, context);
    expect(received).toEqual({
      error: ErrorTypeEnum.INTERNAL_SERVER_ERROR,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: [ErrorTypeEnum.INTERNAL_SERVER_ERROR],
    });
  });
});
