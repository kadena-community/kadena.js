export interface IContentReadTime {
  wordCount?: number;
  readingTimeInMinutes?: number;
}

export const getReadTime = (content?: string): IContentReadTime => {
  const WORDS_PER_MINUTE = 200;
  const result: IContentReadTime = {};
  //Matches words
  //See
  //https://regex101.com/r/q2Kqjg/6
  const regex: RegExp = /\w+/g;
  result.wordCount = (content || '').match(regex)?.length ?? 0;
  result.readingTimeInMinutes = Math.ceil(result.wordCount / WORDS_PER_MINUTE);

  return result;
};
