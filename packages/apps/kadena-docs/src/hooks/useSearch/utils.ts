import MiniSearch, { SearchResult } from 'minisearch';
import { Dispatch, SetStateAction } from 'react';

export const loadSearchResults = async (
  value: string,
  setStaticSearchResults: Dispatch<SetStateAction<SearchResult[]>>,
): Promise<void> => {
  const results = await import('./../../data/searchIndex.json');

  const index = MiniSearch.loadJSON(JSON.stringify(results.default), {
    fields: ['title', 'content'],
    storeFields: ['title', 'content'],
  });

  const data = index.search(value, { prefix: true, fuzzy: 0.3 });

  setStaticSearchResults(data);
};
