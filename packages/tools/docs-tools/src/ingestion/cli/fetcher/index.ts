import type { IFile } from '../types.js';
import * as fs from './fs.js';
import * as http from './http.js';

export const sources = {
  fs,
  http,
} as const;

export const fetchDocuments = async (
  source: keyof typeof sources,
  identifiers: string[],
  options: { ignore: string[] },
): Promise<IFile[]> => {
  return sources[source].fetchFiles(identifiers, options);
};
