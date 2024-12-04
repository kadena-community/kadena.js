import type { IRegisterIdentityProps } from '@/services/registerIdentity';
import type { IRecord } from '@/utils/filterRemovedRecords';
import { store } from '@/utils/store';
import { useEffect, useState } from 'react';

export const useGetAgent = ({ account }: { account: string }) => {
  const [innerData, setInnerData] = useState<IRecord | undefined>();

  const listenToAccount = (result: IRegisterIdentityProps) => {
    setInnerData((v: any) => {
      if (v) return { ...v, alias: result.alias };
      return {
        alias: result.alias,
        account: result.accountName,
      };
    });
  };

  const initInnerData = async () => {
    const data = await store.getAccount({ account });

    setInnerData({
      accountName: account,
      alias: data?.alias,
      creationTime: 0,
    });
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initInnerData();
    const off = store.listenToAccount(account, listenToAccount);
    return off;
  }, [account]);

  return { data: innerData };
};
