import { mkdirSync, readdirSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';

export async function createDirAndWriteFile(
  dir: string,
  fileName: string,
  data: string,
): Promise<void> {
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, fileName), data);
}

export async function clearDir(dir: string, extension?: string): Promise<void> {
  const files = readdirSync(dir);
  for (const file of files) {
    unlinkSync(join(dir, file));
  }
}
