export function isString(token: unknown): token is string {
  return typeof token === 'string';
}

export function isObject(token: unknown): token is Record<string, unknown> {
  return (
    !isNullOrUndefined(token) &&
    typeof token === 'object' &&
    !Array.isArray(token)
  );
}

export function isNullOrUndefined(token: unknown): token is null | undefined {
  return token === null || isUndefined(token);
}

export function isUndefined(token: unknown): token is undefined {
  return token === undefined;
}
