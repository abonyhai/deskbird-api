import {
  CallHandler,
  ExecutionContext,
  GatewayTimeoutException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const timeoutSeconds =
      this.reflector.get<number>('request-timeout', context.getHandler()) || 30;

    return next.handle().pipe(
      timeout(timeoutSeconds * 1000),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          throw new GatewayTimeoutException('Gateway timeout has occurred.');
        }
        return throwError(() => err);
      }),
    );
  }
}
