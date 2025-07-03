export const ERROR_NAMES = [
  'Generic',
  'Not Implemented',
  'Unhandled',

  'Bad Request',
  'Unauthorized',
  'Forbidden',
  'Not Found',
  'Method Not Allowed',

  'Internal Server Error',
] as const;

export type ErrorName = (typeof ERROR_NAMES)[number];

export const ERROR_CODES = [
  'generic',
  'generic/not-implemented',

  'auth/invalid-credentials',
  'auth/insufficient-permissions',
  'auth/id-token-expired',

  'resource/not-found',
  'resource/already-exists',
  'resource/no-subscription',

  'sign-up/invalid-email',
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

export const ErrorDescription: { [key in ErrorCode]: string } = {
  generic: 'Something went wrong.',
  'generic/not-implemented':
    'Your request can not be completed because this functionality is currently under development.',

  'auth/invalid-credentials': 'Missing or invalid user credentials.',
  'auth/insufficient-permissions': 'Insufficient permissions for this action.',
  'auth/id-token-expired':
    'Firebase ID token has expired. Get a fresh ID token from your client app and try again',

  'resource/not-found': 'Resource not found.',
  'resource/already-exists': 'Resource already exists.',
  'resource/no-subscription': 'No subscription found for this resource.',

  'sign-up/invalid-email': 'The email address is improperly formatted.',
};
