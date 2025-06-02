import type { IRegisterIdentityProps } from '@/services/registerIdentity';
import type { IRecord } from '@/utils/filterRemovedRecords';
import { RWAStore } from '@/utils/store';
import { useEffect, useMemo, useState } from 'react';
import { useOrganisation } from './organisation';

export const useGetAgent = ({ account }: { account: string }) => {
  const [innerData, setInnerData] = useState<IRecord | undefined>();
  const { organisation } = useOrganisation();
  const store = useMemo(() => {
    if (!organisation) return;
    return RWAStore(organisation);
  }, [organisation]);

  const listenToAccount = (result: IRegisterIdentityProps) => {
    setInnerData((v: any) => {
      if (v) return { ...v, alias: result.alias };
      return {
        alias: result.alias,
        account: result.accountName,
      };
    });
  };

  useEffect(() => {
    const initInnerData = async () => {
      const data = await store?.getAccount({ account });

      setInnerData({
        accountName: account,
        alias: data?.alias,
        creationTime: 0,
      });
    };
    if (!account) return;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initInnerData();
    const off = store?.listenToAccount(account, listenToAccount);
    return off;
  }, [account, store]);

  return { data: innerData };
};
