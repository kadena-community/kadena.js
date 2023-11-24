import { readFileSync } from 'fs';

interface IReadFileOptions {
  encoding?: BufferEncoding | null;
  flag?: string;
}

export const readFile = (
  path: string,
  options?: IReadFileOptions | BufferEncoding,
) => {
  return readFileSync(path, options);
};
