// Borrowed from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze

export function deepFreeze<T extends object>(object: T): T {
  const propNames = Reflect.ownKeys(object);
  for (const name of propNames) {
    const value = object[name as keyof T];
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (value && (typeof value === 'object' || typeof value === 'function')) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      deepFreeze(value as any);
    }
  }
  return Object.freeze(object);
}
