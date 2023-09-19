import type { StreamMetaData } from '@7-docs/edge';
import algoliasearch from 'algoliasearch';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface IHookResult {
  handleSubmit: (query: string) => void;
  metadata: StreamMetaData[];
  isLoading: boolean;
  error: string | undefined;
}

export default function useAlgoliaSearch(limitResults = 25): IHookResult {
  const client = algoliasearch(
    'BD67NIA9JD',
    '2a38c9156d62b12da7a1dfa759a7ae39',
  );
  const index = client.initIndex('docs_website_dev');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<undefined | string>(undefined);
  const [metaData, setMetadata] = useState<StreamMetaData[]>([]);
  const router = useRouter();

  function handleSubmit(query: string): void {
    setIsLoading(true);
    index
      .search(query, { hitsPerPage: limitResults })
      .then(({ hits }) => {
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
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        router.push(`${router.route}?q=${query}`);
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
