import { getPrincipalNamespace } from '@/services/getPrincipalNamespace';
import { useEffect, useState } from 'react';
import { useAccount } from './account';

export const useGetPrincipalNamespace = () => {
  const { account } = useAccount();
  const [innerData, setInnerData] = useState<string | undefined>();

  const initInnerData = async () => {
    const data = await getPrincipalNamespace({ owner: account! });
    setInnerData(data);
  };

  useEffect(() => {
    if (!account) return;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initInnerData();
  }, [account]);

  return { data: innerData };
};
