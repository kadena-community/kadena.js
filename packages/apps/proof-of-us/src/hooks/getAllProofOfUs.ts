import { getAllProofOfUs } from '@/utils/proofOfUs';
import { useEffect, useState } from 'react';

export const useGetAllProofOfUs: IDataHook<IProofOfUs[]> = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<IError>();
  const [data, setData] = useState<IProofOfUs[]>([]);

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
