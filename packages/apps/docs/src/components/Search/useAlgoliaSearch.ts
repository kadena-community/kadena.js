import type { StreamMetaData } from '@7-docs/edge';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface IHookResult {
  handleSubmit: (query: string) => void;
  metadata: StreamMetaData[];
  isLoading: boolean;
  error: string | undefined;
}

export default function useAlgoliaSearch(limitResults = 25): IHookResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<undefined | string>(undefined);
  const [metaData, setMetadata] = useState<StreamMetaData[]>([]);
  const router = useRouter();

  async function handleSubmit(query: string): Promise<void> {
    setIsLoading(true);
    const url = `/api/semanticsearch?search=${encodeURIComponent(
      query,
    )}&limit=${limitResults}`;

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await fetch(url, options);

      if (response.ok) {
        const data = await response.json();
        setIsLoading(false);
        setMetadata(data);
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        router.push(`${router.route}?q=${query}`);
      }
    } catch (e) {
      setIsLoading(false);
      setError(e.message);
    }
  }

  return {
    handleSubmit,
    metadata: metaData,
    isLoading,
    error,
  };
}
