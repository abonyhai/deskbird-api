import { ERROR_NAMES, ErrorName } from './types';

export const isErrorName = (s: any): s is ErrorName => ERROR_NAMES.includes(s);

export const createExceptionDescription = (errors: ErrorName[]) =>
  errors.length > 0
    ? `Possible error codes: [${errors.map((t) => ` ${t}`).join(',')}]`
    : 'No specific error codes mentioned';
