import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable, CallHandler, NestInterceptor, ExecutionContext } from '@nestjs/common';

/**
 * [description]
 */
export interface Response<T> {
  data: string[] | T;
}

/**
 * [description]
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  /**
   * [description]
   * @param context
   * @param next
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(map((data) => ({ data })));
  }
}
