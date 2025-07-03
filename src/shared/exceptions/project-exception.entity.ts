import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode, ErrorDescription, ErrorName } from './types';

export class ProjectException extends HttpException {
  constructor({
    errorName,
    httpStatus,
    errorCode,
    details,
    debug,
  }: {
    errorName: ErrorName;
    httpStatus?: HttpStatus;
    errorCode?: ErrorCode;
    details?: string;
    debug?: any;
  }) {
    let status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let code: ErrorCode = 'generic';

    switch (errorName) {
      case 'Bad Request':
        status = HttpStatus.BAD_REQUEST;
        break;
      case 'Unauthorized':
        status = HttpStatus.UNAUTHORIZED;
        code = 'auth/invalid-credentials';
        break;
      case 'Forbidden':
        status = HttpStatus.FORBIDDEN;
        code = 'auth/insufficient-permissions';
        break;
      case 'Not Found':
        status = HttpStatus.NOT_FOUND;
        code = 'resource/not-found';
        break;
      case 'Method Not Allowed':
        status = HttpStatus.METHOD_NOT_ALLOWED;
        break;
      case 'Internal Server Error':
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        code = 'generic';
        break;
      case 'Not Implemented':
        status = HttpStatus.NOT_IMPLEMENTED;
        code = 'generic/not-implemented';
        break;
      default:
        break;
    }

    if (httpStatus) {
      status = httpStatus;
    }
    if (errorCode) {
      code = errorCode;
    }

    const errorDescription = ErrorDescription[code];

    super(errorName, status, {
      cause: errorDescription,
      description: details || '',
    });

    this.code = code;
    this.debug = debug;
  }

  public code: string;

  public debug: object | string;
}
