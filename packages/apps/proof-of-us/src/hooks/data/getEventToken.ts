import { getProofOfUs } from '@/utils/proofOfUs';
import { useEffect, useState } from 'react';

export const useGetEventToken: IDataHook<IProofOfUsToken | undefined> = (
  id: string,
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState<IError>();
  const [data, setData] = useState<IProofOfUsToken | undefined>(undefined);

  const load = async () => {
    setHasError(undefined);
    setIsLoading(true);

    setTimeout(async () => {
      const result = await getProofOfUs(id);

      setData(result);

      setIsLoading(false);
    }, 100);
  };

  useEffect(() => {
    load();
  }, []);

  return { isLoading, hasError, data };
};
