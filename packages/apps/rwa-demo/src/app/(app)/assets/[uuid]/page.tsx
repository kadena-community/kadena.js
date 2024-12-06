'use client';
import type { IAsset } from '@/components/AssetProvider/AssetProvider';
import { useAsset } from '@/hooks/asset';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const Assets = () => {
  const { getAsset } = useAsset();
  const [asset, setAsset] = useState<IAsset | undefined>();
  const { uuid } = useParams();

  const initData = async (uuid: string) => {
    const data = await getAsset(uuid);
    setAsset(data);
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initData(uuid as string);
  }, [uuid]);

  return <pre>{JSON.stringify(asset, null, 2)}</pre>;
};

export default Assets;
