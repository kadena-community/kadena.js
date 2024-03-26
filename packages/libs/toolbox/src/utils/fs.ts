import { mkdir, stat, writeFile as writeFileN } from 'node:fs/promises';
import { dirname } from 'pathe';

export const writeFileAtPath: typeof writeFileN = async (
  path,
  data,
  options,
) => {
  if (typeof path !== 'string') throw new Error('path must be a string');
  const exist = await stat(path)
    .then(() => true)
    .catch(() => false);
  if (!exist) {
    const dir = dirname(path);
    await mkdir(dir, { recursive: true });
  }
  return writeFileN(path, data, options);
};
