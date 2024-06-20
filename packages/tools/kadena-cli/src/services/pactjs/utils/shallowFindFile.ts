import { join } from 'path';
import { fileSystemService } from '../../fs/fs.service.js';

export async function shallowFindFile(
  path: string,
  file: string,
): Promise<string | undefined> {
  while (!(await fileSystemService.fileExists(join(path, file)))) {
    path = join(path, '..');
    if (path === '/') {
      return;
    }
  }
  return join(path, file);
}
