const parseMD = require('parse-md').default;
import fs from 'fs';

export async function extractMetadataFromMarkdown(
  path: string,
): Promise<IMetadata> {
  const parentFile = fs.readFileSync(`${path}/index.md`, 'utf8');
  const parsedMd = parseMD(parentFile);
  return parsedMd.metadata as IMetadata;
}

export interface IMetadata {
  title: string;
  description: string;
  menu: string;
  label: string;
  order: number;
  layout: 'full';
}
