import {
  Catch,
  Logger,
  HttpStatus,
  ArgumentsHost,
  HttpException,
  ExceptionFilter,
} from '@nestjs/common';
import { URL } from 'node:url';
import { FastifyReply } from 'fastify';

import { ErrorTypeEnum } from '../enums';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(AllExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost): FastifyReply {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse<FastifyReply>();

    const statusCode =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const { message, error } =
      exception instanceof HttpException
        ? (exception.getResponse() as Record<string, any>)
        : {
            message: ErrorTypeEnum.INTERNAL_SERVER_ERROR,
            error: ErrorTypeEnum.INTERNAL_SERVER_ERROR,
          };

    this.logger.error(
      {
        url: new URL(request.url, 'logger://').pathname,
        method: request.method,
        params: request.params,
        query: request.query,
        body: request.body,
        user: request.user,
        statusCode,
        message,
      },
      exception.stack,
    );

    return response.status(statusCode).send({ error, statusCode, message: [].concat(message) });
  }
}
