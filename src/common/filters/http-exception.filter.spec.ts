import { NotFoundException } from '@nestjs/common';

import { HttpExceptionFilter } from './http-exception.filter';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;

  const exception = new NotFoundException();
  const context: any = {
    switchToHttp: jest.fn(() => ({
      getResponse: () => ({
        status() {
          return this;
        },
        send() {
          return this;
        },
      }),
    })),
  };

  beforeAll(() => {
    filter = new HttpExceptionFilter();
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should return an error in specified format', () => {
    const { message, statusCode, error } = exception.getResponse() as Record<string, any>;
    const received = filter.catch(exception, context);
    expect(received).toEqual({ error, statusCode, message: [].concat(message) });
  });
});
