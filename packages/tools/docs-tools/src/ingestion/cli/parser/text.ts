import type { DocumentParser, IDocumentSection } from '../types.js';
import { splitContentAtSentence } from './util.js';

export const parser: DocumentParser = (text, maxLength) => {
  const sections: IDocumentSection[] = [];

  const splitContent = splitContentAtSentence(String(text), maxLength);
  splitContent.forEach((chunk) => {
    sections.push({ content: chunk.trim() });
  });

  return { sections };
};
