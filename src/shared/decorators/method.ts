import {
  applyDecorators,
  Delete,
  HttpCode,
  SetMetadata,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  Get,
  Patch,
  Post,
} from '@nestjs/common/decorators/http/request-mapping.decorator';
import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiQuery,
  ApiQueryOptions,
} from '@nestjs/swagger';
import { ApiBodyOptions } from '@nestjs/swagger/dist/decorators/api-body.decorator';
import { ApiResponseOptions } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { TimeoutInterceptor } from '../interceptors/timeout.interceptor';
import { ValidationPipeOptions } from '@nestjs/common/pipes/validation.pipe';

export const ApiProjectRoute = ({
  path,
  method,
  queries,
  body,
  pipeOptions,
  ok,
  timeout,
}: {
  path: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  queries?: ApiQueryOptions[];
  body?: ApiBodyOptions;
  pipeOptions?: ValidationPipeOptions;
  ok: ApiResponseOptions;
  timeout?: number; // Timeout value in seconds
}) => {
  const list = [HttpCode(200)];
  ok && list.push(ApiOkResponse(ok));

  switch (method) {
    case 'GET':
      list.push(Get(path));
      break;
    case 'POST':
      list.push(Post(path));
      break;
    case 'PATCH':
      list.push(Patch(path));
      break;
    case 'DELETE':
      list.push(Delete(path));
      break;
    default:
      throw new Error('Method Not Allowed');
  }

  list.push(
    ApiInternalServerErrorResponse({ description: 'Internal server error' }),
  );

  queries && queries.forEach((query) => list.push(ApiQuery(query)));
  body && list.push(ApiBody(body));

  if (timeout !== undefined && timeout > 0) {
    list.push(SetMetadata('request-timeout', timeout));
    list.push(UseInterceptors(TimeoutInterceptor));
  }

  if (pipeOptions !== undefined) {
    list.push(UsePipes(new ValidationPipe(pipeOptions)));
  }

  return applyDecorators(...list);
};
