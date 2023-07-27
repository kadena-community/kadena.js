import { IMenuData } from '@/types/Layout';
import { useEffect, useState } from 'react';

interface IReturn {
  handleLoad: (isRetry: boolean) => void;
  isLoading: boolean;
  error?: string;
  isDone: boolean;
  data: IMenuData[];
}

export const useGetBlogs = (): IReturn => {
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

      if (items.length < limit) {
        setIsDone(true);
      }
    } catch (e) {
      setIsLoading(false);
      setError('There was an issue, please try again later');
    }
  };

  const handleLoad = (isRetry: boolean): void => {
    if ((isDone || error !== undefined) && !isRetry) {
      setIsLoading(false);
      return;
    }

    if (isRetry) {
      setError(undefined);
    }
    setIsLoading(true);
  };

  useEffect(() => {
    if (!isLoading || error !== undefined) return;
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
