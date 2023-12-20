import { nullishOrEmpty } from './nullish-or-empty';

export function validateObjectProperties<T extends Record<string, any>>(
  obj: T,
  typeName: string,
): void {
  Object.entries(obj).forEach(([key, value]) => {
    console.log(key, value);
    if (nullishOrEmpty(value)) {
      throw new Error(`${typeName} ${key} not specified`);
    }
  });
}
