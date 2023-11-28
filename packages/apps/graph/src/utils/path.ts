import {
  mkdirSync,
  readFileSync,
  readdirSync,
  unlinkSync,
  writeFileSync,
} from 'fs';
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
    if (extension && !file.endsWith(extension)) {
      continue;
    }
    unlinkSync(join(dir, file));
  }
}

export async function readDir(dir: string): Promise<string[]> {
  return readdirSync(dir);
}

export async function readFile(dir: string, filename: string): Promise<string> {
  return readFileSync(join(dir, filename), 'utf8');
}
