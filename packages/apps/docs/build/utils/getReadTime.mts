import type { Content } from 'mdast';
import { IMenuData } from '../../src/Layout';

export type ReadTime = Pick<IMenuData, 'wordCount' | 'readingTimeInMinutes'>;
export const getReadTime = (content: string): ReadTime => {
  const WORDS_PER_MINUTE = 200;
  let result: ReadTime = {};

  const regex = /\w+/g;
  result.wordCount = (content || '').match(regex)?.length ?? 0;
  result.readingTimeInMinutes = Math.ceil(result.wordCount / WORDS_PER_MINUTE);

  return result;
};
