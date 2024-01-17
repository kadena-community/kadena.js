import { getPou } from '@/utils/pou';
import { useEffect, useState } from 'react';

export const useGetPou: IDataHook<IPou | undefined> = ({ id }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<IError>();
  const [data, setData] = useState<IPou | undefined>(undefined);

  const load = async () => {
    setError(undefined);
    const result = await getPou(id);

    setData(result);
  };

  useEffect(() => {
    if ((data || error) && isLoading) {
      setIsLoading(false);
    }
  }, [data, error, isLoading]);

  useEffect(() => {
    load();
  }, []);

  return {
    isLoading,
    error,
    data,
  };
};
