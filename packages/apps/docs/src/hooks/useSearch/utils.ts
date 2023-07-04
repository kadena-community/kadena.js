import type { AsPlainObject, SearchResult } from 'minisearch';
import MiniSearch from 'minisearch';
import { Dispatch, SetStateAction } from 'react';

const createGetIndex = (): (() => Promise<MiniSearch>) => {
  let index: MiniSearch;

  return async (): Promise<MiniSearch> => {
    if (index === undefined) {
      const data = await import('./../../data/searchIndex.json');
      const results: AsPlainObject = data.default;

      // eslint-disable-next-line require-atomic-updates
      index = MiniSearch.loadJSON(JSON.stringify(results), {
        fields: ['title', 'content', 'description'],
        storeFields: ['title', 'filename', 'description'],
      });
    }

    return index;
  };
};

const getIndex = createGetIndex();

export const loadSearchResults = async (
  value: string,
  setStaticSearchResults: Dispatch<SetStateAction<SearchResult[]>>,
): Promise<void> => {
  const index = await getIndex();
  const data = index.search(value, {
    prefix: true,
    fuzzy: 0.3,
    boost: { title: 2 },
  });

  setStaticSearchResults(data);
};
