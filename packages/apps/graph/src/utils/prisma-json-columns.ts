import type { Prisma } from '@prisma/client';

export class PrismaJsonColumnParsingError extends Error {
  public query?: string;
  public subscription?: string;
  public queryParameter: string;
  public column: string;

  public constructor(options: {
    message: string;
    query?: string;
    subscription?: string;
    queryParameter: string;
    column: string;
  }) {
    super(options.message);
    this.query = options.query;
    this.subscription = options.subscription;
    this.queryParameter = options.queryParameter;
    this.column = options.column;
  }
}

export function parsePrismaJsonColumn<T>(
  value: string,
  meta: {
    query?: string;
    subscription?: string;
    queryParameter: string;
    column: string;
  },
): Prisma.JsonFilter<T> {
  try {
    return JSON.parse(value);
  } catch (error) {
    throw new PrismaJsonColumnParsingError({
      message: `Unable to parse '${value}' as JSON.`,
      query: meta.query,
      subscription: meta.subscription,
      queryParameter: meta.queryParameter,
      column: meta.column,
    });
  }
}
