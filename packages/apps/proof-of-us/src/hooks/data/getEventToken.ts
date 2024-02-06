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
        image:
          'https://pbs.twimg.com/profile_images/1643582036551118848/1ga1McZu_400x400.jpg',
        name: 'Devworld 24',
        properties: {
          type: 'event',
          date: 1709197180,
          avatar: {
            backgroundColor: '#4c0e5c',
            color: '#FFFFFF',
          },
        },
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
