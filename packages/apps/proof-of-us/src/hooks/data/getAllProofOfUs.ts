import { getAllProofOfUs } from '@/utils/proofOfUs';
import { useEffect, useState } from 'react';

export const useGetAllProofOfUs: IDataHook<IProofOfUsToken[]> = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<IError>();
  const [data, setData] = useState<IProofOfUsToken[]>([]);

  const load = async () => {
    const result = await getAllProofOfUs();
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
