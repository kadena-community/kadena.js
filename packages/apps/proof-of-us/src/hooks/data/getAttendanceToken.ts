import { fetchManifestData } from '@/utils/fetchManifestData';
import { getProofOfUs } from '@/utils/proofOfUs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

export const useGetAttendanceToken: IDataHook<
  IProofOfUsTokenMeta | undefined
> = (id: string) => {
  const router = useRouter();
  const [isTokenLoading, setIsTokenLoading] = useState(false);
  const [hasError, setHasError] = useState<IError>();
  const [token, setToken] = useState<IProofOfUsToken | undefined>();

  const { data, isLoading } = useSWR(token?.uri, fetchManifestData, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  const load = async () => {
    if (!id) return;
    const result = await getProofOfUs(id);

    if (!result) {
      router.push('/404');
      return;
    }
    setToken(result);
  };

  useEffect(() => {
    if (!data) return;

    setIsTokenLoading(false);
  }, [data]);

  useEffect(() => {
    setHasError(undefined);
    // setIsTokenLoading(true);
    load();
  }, [id]);

  const startDate = token && token['starts-at'].int;
  const endDate = token && token['ends-at'].int;

  const newData = data
    ? { ...data, startDate, endDate, manifestUri: token?.uri }
    : undefined;

  console.log({ newData });
  return {
    isLoading: isLoading || isTokenLoading,
    hasError,
    data: newData,
    token,
  };
};
