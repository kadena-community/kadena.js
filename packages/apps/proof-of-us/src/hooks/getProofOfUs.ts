import { getProofOfUs } from '@/utils/proofOfUs';
import { useEffect, useState } from 'react';

export const useGetProofOfUs: IDataHook<IProofOfUsData | undefined> = ({
  id,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<IError>();
  const [data, setData] = useState<IProofOfUsData | undefined>(undefined);

  const load = async () => {
    if (id === 'new') {
      return;
    }
    setError(undefined);
    const result = await getProofOfUs(id);

    setData(result?.data);
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
