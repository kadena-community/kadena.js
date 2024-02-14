import { fetchManifestData } from '@/utils/fetchManifestData';
import { getProofOfUs } from '@/utils/proofOfUs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const useGetAttendanceToken: IDataHook<
  IProofOfUsTokenMeta | undefined
> = (id: string) => {
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
    const data = await fetchManifestData(result);

    if (!data) {
      console.error('no data found');
      router.replace('/404');
      return;
    }

    setData({
      ...data,
      startDate: result['starts-at'].int,
      endDate: result['ends-at'].int,
    });
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
