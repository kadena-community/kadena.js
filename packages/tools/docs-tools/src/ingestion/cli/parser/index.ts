import { extname } from 'node:path';
import type {
  AsyncDocumentParser,
  DocumentParser,
  IParsedDocument,
} from '../types.js';
import { parser as HTMLParser } from './html.js';
import { parser as MarkdownParser } from './md.js';
import { parser as MDXParser } from './mdx.js';
import { parser as TextParser } from './text.js';

const parsers: Record<string, DocumentParser | AsyncDocumentParser> = {
  '.html': HTMLParser,
  '.md': MarkdownParser,
  '.mdx': MDXParser,
  '.markdown': MarkdownParser,
  default: TextParser,
};

export const parseDocument = async (
  filePath: string,
  document: Buffer,
  maxLength: number,
): Promise<IParsedDocument> => {
  const ext = extname(filePath);
  const parser = ext in parsers ? parsers[ext] : parsers.default;
  const { title = filePath, sections } = await parser(document, maxLength);
  return { title, sections };
};
