export class PrismaJsonColumnParsingError extends Error {
  query?: string;
  subscription?: string;
  queryParameter: string;
  column: string;

  constructor(options: {
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

export function parsePrismaJsonColumn(
  value: string,
  meta: {
    query?: string;
    subscription?: string;
    queryParameter: string;
    column: string;
  },
) {
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
