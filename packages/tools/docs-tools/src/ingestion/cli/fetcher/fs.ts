import fg from 'fast-glob';
import fs from 'node:fs/promises';
import type { FetchFiles } from '../types.js';

interface IFileData {
  filePath: string;
  url: string;
  content: Buffer;
}

const getFileData = async (filePath: string): Promise<IFileData> => {
  console.log('files: ', filePath);
  return { filePath, url: '', content: await fs.readFile(filePath) };
};

export const fetchFiles: FetchFiles = async (patterns, { ignore }) => {
  const files = await fg(patterns, { ignore });
  return Promise.all(files.map(getFileData));
};
