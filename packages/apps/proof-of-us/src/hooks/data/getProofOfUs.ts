import { getProofOfUs } from '@/utils/proofOfUs';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export const useGetProofOfUs: IDataHook<IProofOfUsToken | undefined> = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<IError>();
  const [data, setData] = useState<IProofOfUsToken | undefined>(undefined);
  const { id } = useParams();

  const load = async () => {
    setError(undefined);
    const result = await getProofOfUs(`${id}`);

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
