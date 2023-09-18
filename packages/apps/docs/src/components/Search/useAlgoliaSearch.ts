import type { StreamMetaData } from '@7-docs/edge';
import algoliasearch from 'algoliasearch';
import { useState } from 'react';

interface IProps {
  limitResults?: number;
}

export default function useAlgoliaSearch(limitResults = 25) {
  const client = algoliasearch(
    'BD67NIA9JD',
    '0e7307de57fb813aab55f7429257aa61',
  );
  const index = client.initIndex('docs_website_dev');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<undefined | string>(undefined);
  const [metaData, setMetadata] = useState<StreamMetaData[]>([]);

  function handleSubmit(query: string) {
    console.log('handleSubmit', query);
    setIsLoading(true);
    console.log('handleSubmit');
    index
      .search(query, { hitsPerPage: limitResults })
      .then(({ hits }) => {
        console.log({
          hits,
        })
        setIsLoading(false);
        const mappedData = hits.map((hit) => {
          // @ts-ignore
          const { filePath, title, content, url, header } = hit || {};
          return {
            filePath,
            title,
            content,
            url,
            header,
          };
        });
        setMetadata(mappedData);
        console.log('handleSubmit', mappedData);
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err.message);
      });
  }

  return {
    handleSubmit,
    metadata: metaData,
    isLoading,
    error,
  };
}
