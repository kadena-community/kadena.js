import { getProofOfUs } from '@/utils/proofOfUs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const useGetEventToken: IDataHook<IProofOfUsToken | undefined> = (
  id: string,
) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState<IError>();
  const [data, setData] = useState<IProofOfUsToken | undefined>();

  const load = async () => {
    setHasError(undefined);
    setIsLoading(true);

    const result = await getProofOfUs(id);

    console.log(11111, { result });
    if (!result) {
      router.push('/404');
      return;
    }

    setData(result);

    setIsLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return { isLoading, hasError, data };
};
