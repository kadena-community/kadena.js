import type { SearchResult } from 'minisearch';
import MiniSearch from 'minisearch';
import { Dispatch, SetStateAction } from 'react';

const createGetResults = () => {
  let results: {
    default: {};
  };

  return async (): Promise<{}> => {
    if (!results) {
      // eslint-disable-next-line require-atomic-updates
      results = await import('./../../data/searchIndex.json');
    }
    return results.default;
  };
};

const getResults = createGetResults();

export const loadSearchResults = async (
  value: string,
  setStaticSearchResults: Dispatch<SetStateAction<SearchResult[]>>,
): Promise<void> => {
  const results = await getResults();
  const index = MiniSearch.loadJSON(JSON.stringify(results), {
    fields: ['title', 'content'],
    storeFields: ['title', 'content'],
  });

  const data = index.search(value, { prefix: true, fuzzy: 0.3 });

  setStaticSearchResults(data);
};
