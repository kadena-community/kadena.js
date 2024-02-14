import { fetchManifestData } from '@/utils/fetchManifestData';
import { getAllProofOfUs } from '@/utils/proofOfUs';
import { useEffect, useState } from 'react';

export const useGetAllProofOfUs: IDataHook<IProofOfUsTokenMeta[]> = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<IError>();
  const [data, setData] = useState<IProofOfUsTokenMeta[]>([]);

  const load = async () => {
    const result = await getAllProofOfUs();

    const promises = result.map((token) => {
      return fetchManifestData(token);
    });

    const data = await Promise.all(promises);
    const filteredData = data.filter(
      (d) => d !== undefined,
    ) as IProofOfUsTokenMeta[];

    setData(filteredData);
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
