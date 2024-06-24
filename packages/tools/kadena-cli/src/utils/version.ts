import fs from 'node:fs/promises';
import { safeJsonParse } from './globalHelpers.js';

export const getVersion = async (): Promise<string> => {
  const filepath = new URL('../../package.json', import.meta.url);
  const file = await fs.readFile(filepath, 'utf8').catch(() => null);
  if (file === null) return 'unknown';
  const json = safeJsonParse<{ version?: string }>(file);
  return json?.version ?? 'unknown';
};
