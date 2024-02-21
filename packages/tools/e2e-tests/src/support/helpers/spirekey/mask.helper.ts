import { maskValue } from '@kadena/react-ui';

export function maskAccount(str: string): string {
  if (str.startsWith('c:')) {
    str = str.substring(2);
  }
  return maskValue(str, {
    headLength: 4,
    tailLength: 4,
    character: '.',
  });
}
