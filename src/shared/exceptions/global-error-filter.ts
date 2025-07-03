import { ArgumentsHost, Catch, HttpException, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ProjectException } from './project-exception.entity';
import { ErrorName } from './types';
import { isErrorName } from './utils';
import { IS_PRODUCTION } from '../constants';

@Catch()
export class GlobalErrorFilter extends BaseExceptionFilter {
  private readonly logger = new Logger('GlobalErrorFilter');

  catch(exception: any, host: ArgumentsHost): unknown {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    let rawString;
    try {
      rawString = JSON.stringify(exception);
    } catch (e) {
      rawString = '';
    }

    let logMessage: string = exception?.cause || exception?.message;

    const extraData = {
      validationError: req?.validationError,
      query: req?.query,
      body: req?.body,
      routerMethod: req?.routeOptions?.method,
      routerPath: req?.routeOptions?.url,
      summary: `Name: '${exception?.name}', Message: '${exception?.message}'`,
      ...(!IS_PRODUCTION()
        ? {
            stacktrace: exception?.stack || '',
            headers: req?.headers,
            raw: rawString?.length > 0 ? rawString : undefined,
          }
        : {}),
    };

    let parsedException;
    let status: number;

    if (exception instanceof ProjectException) {
      status = exception.getStatus();
      parsedException = exception;
      parsedException.debug = extraData;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();
      let name: ErrorName = 'Generic';
      let message = '';

      if (typeof response == 'object') {
        if ('error' in response && isErrorName(response.error)) {
          name = response?.error || 'Generic';
        }
        if ('message' in response) {
          if (typeof response.message === 'string') {
            message = response.message;
            logMessage = message;
          } else if (Array.isArray(response.message)) {
            message = response.message.join('\n');
            logMessage = message;
          }
        }
      }

      parsedException = new ProjectException({
        errorName: name,
        httpStatus: status,
        details: message,
        debug: extraData,
      });
    } else {
      status = 500;
      parsedException = new ProjectException({
        errorName: 'Unhandled',
        httpStatus: status,
        details: exception?.['details'],
        debug: extraData,
      });
    }

    this.logger.error(
      logMessage,
      !IS_PRODUCTION() ? exception?.stack : undefined,
    );

    try {
      const strException = JSON.stringify(parsedException);
      return res.status(status).send(strException);
    } catch (error) {
      return res.status(status).send(parsedException);
    }
  }
}
