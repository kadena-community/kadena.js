import { getProofOfUs } from '@/utils/proofOfUs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const useGetEventToken: IDataHook<IProofOfUsTokenMeta | undefined> = (
  id: string,
) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState<IError>();
  const [data, setData] = useState<IProofOfUsTokenMeta | undefined>();

  const load = async () => {
    const result = await getProofOfUs(id);

    if (!result) {
      router.push('/404');
      return;
    }

    //load metadata
    const fetchResult = await fetch(result.uri);
    const data = (await fetchResult.json()) as IProofOfUsTokenMeta;

    setData(data);
  };

  useEffect(() => {
    if (!data) return;

    setIsLoading(false);
  }, [data]);

  useEffect(() => {
    setHasError(undefined);
    setIsLoading(true);
    load();
  }, []);

  return { isLoading, hasError, data };
};
