import { join } from 'path';
import { services } from '../../../services/index.js';

export const shallowFindFile = async (
  path: string,
  file: string,
): Promise<string | undefined> => {
  while (!(await services.filesystem.fileExists(join(path, file)))) {
    path = join(path, '..');
    if (path === '/') {
      return;
    }
  }
  return join(path, file);
};
