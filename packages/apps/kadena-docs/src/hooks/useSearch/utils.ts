import type { AsPlainObject, SearchResult } from 'minisearch';
import MiniSearch from 'minisearch';
import { Dispatch, SetStateAction } from 'react';

const createGetResults = (): (() => Promise<AsPlainObject>) => {
  let results: AsPlainObject;

  return async (): Promise<AsPlainObject> => {
    if (results === undefined) {
      const data = await import('./../../data/searchIndex.json');
      // eslint-disable-next-line require-atomic-updates
      results = data.default as unknown as AsPlainObject;
    }
    return results;
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
