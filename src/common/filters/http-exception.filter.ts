import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { FastifyReply } from 'fastify';

/**
 * [description]
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   * [description]
   */
  catch(exception: HttpException, host: ArgumentsHost): FastifyReply {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const statusCode = exception.getStatus();
    const { message, error } = exception.getResponse() as Record<string, any>;
    return response.status(statusCode).send({ error, statusCode, message: [].concat(message) });
  }
}
