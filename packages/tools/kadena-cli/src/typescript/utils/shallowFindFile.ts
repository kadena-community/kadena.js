import { existsSync } from 'fs';
import { join } from 'path';

export const shallowFindFile = (path: string, file: string): string | undefined => {
  while (!existsSync(join(path, file))) {
    path = join(path, '..');
    if (path === '/') {
      return;
    }
  }
  return join(path, file);
};
