import { useEffect, useState } from 'react';

export const useGetEventToken: IDataHook<IProofOfUsToken | undefined> = (
  id: string,
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<IError>();
  const [data, setData] = useState<IProofOfUsToken | undefined>(undefined);

  // const retrieveToken = async () => {
  //   const result = await getToken(DEVWORLD_TOKENID);
  //   setToken(result);
  // };

  const load = async () => {
    setError(undefined);
    setIsLoading(true);

    setTimeout(() => {
      const result: IProofOfUsToken = {
        tokenId: 't:ZlfM7Ugw86DtzuPN-Xas90vJ0NLl6C62qtJ-QlI_Hxc',
        title: 'Devworld 24',
        type: 'event',
        date: 1709197180,
      };
      setData(result);

      setIsLoading(false);
    }, 3000);
  };

  useEffect(() => {
    load();
  }, []);

  return { isLoading, error, data };
};
