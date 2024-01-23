import { getProofOfUs } from '@/utils/proofOfUs';
import { useEffect, useState } from 'react';

export const useGetProofOfUs: IDataHook<IProofOfUs | undefined> = ({ id }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<IError>();
  const [data, setData] = useState<IProofOfUs | undefined>(undefined);

  const load = async () => {
    setError(undefined);
    const result = await getProofOfUs(id);

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
