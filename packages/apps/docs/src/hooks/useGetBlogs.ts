import { IMenuData } from '@/types/Layout';
import { useEffect, useState } from 'react';

export const useGetBlogs = () => {
  const limit = 10;
  const [offset, setOffset] = useState<number>(limit);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [data, getData] = useState<IMenuData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  const get = async (): Promise<void> => {
    setError(undefined);
    if (isDone) return;
    try {
      const result = await fetch(`/api/blog?offset=${offset}&limit=${limit}`);
      const items = (await result.json()) as IMenuData[];
      getData((v) => [...v, ...items]);
      setOffset((v) => v + limit);

      if (data.length < limit) {
        setIsDone(true);
      }
    } catch (e) {
      setIsLoading(false);
      setError('There was an issue, please try again later');
    }
  };

  const handleLoad = (): void => {
    if (isDone || error !== undefined) return;
    setIsLoading(true);
  };

  useEffect(() => {
    if (!isLoading) return;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    get();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  useEffect(() => {
    setIsLoading(false);
  }, [setIsLoading, data]);

  return {
    handleLoad,
    isLoading,
    error,
    isDone,
    data,
  };
};
