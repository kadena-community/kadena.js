// eslint-disable-next-line @kadena-dev/no-eslint-disable
/* eslint-disable @typescript-eslint/naming-convention */

const errorMessages = {
  error: 'Something went wrong.',
  no_kadena_directory:
    'Kadena directory not found. use `kadena config init` to create one.',
} as const;

type ErrorCode = keyof typeof errorMessages;

export class KadenaError extends Error {
  public code: ErrorCode;
  public data?: Record<string, unknown>;
  public constructor(code: ErrorCode, data?: Record<string, unknown>) {
    super(errorMessages[code]);
    this.name = 'KadenaError';
    this.code = code;
    this.data = data;
  }
}
