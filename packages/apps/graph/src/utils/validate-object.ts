import { nullishOrEmpty } from './nullish-or-empty';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateObjectProperties<T extends Record<string, any>>(
  obj: T,
  typeName: string,
): boolean {
  Object.entries(obj).forEach(([key, value]) => {
    console.log(key, value);
    if (nullishOrEmpty(value)) {
      throw new Error(`${typeName} ${key} not specified`);
    }
  });

  return true;
}
