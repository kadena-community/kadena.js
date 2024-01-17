import { getAll } from '@/utils/pou';
import { useEffect, useState } from 'react';

export const useGetAllPous: IDataHook<IPou[]> = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<IError>();
  const [data, setData] = useState<IPou[]>([]);

  const load = async () => {
    const result = await getAll();
    setData(result);
  };

  useEffect(() => {
    load();
  }, [setError, setIsLoading, setData]);

  return {
    isLoading,
    error,
    data,
  };
};
