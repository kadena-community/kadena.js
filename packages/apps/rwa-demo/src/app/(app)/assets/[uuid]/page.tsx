'use client';
import type { IWalletAccount } from '@/components/AccountProvider/utils';
import type { IAsset } from '@/components/AssetProvider/AssetProvider';
import { useAccount } from '@/hooks/account';
import { useAsset } from '@/hooks/asset';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const Assets = () => {
  const { getAsset } = useAsset();
  const { account } = useAccount();
  const [asset, setAsset] = useState<IAsset | undefined>();
  const { uuid } = useParams();

  const initData = async (uuid: string, account: IWalletAccount) => {
    const data = await getAsset(uuid, account);
    setAsset(data);
  };

  useEffect(() => {
    if (!account) return;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initData(uuid as string, account);
  }, [uuid, account?.address]);

  return <pre>{JSON.stringify(asset, null, 2)}</pre>;
};
export default Assets;
