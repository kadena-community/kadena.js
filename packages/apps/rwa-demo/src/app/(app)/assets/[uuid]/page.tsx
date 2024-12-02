'use client';
import { useAsset } from '@/hooks/asset';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

const Assets = () => {
  const { getAsset } = useAsset();
  const { uuid } = useParams();
  const asset = useMemo(() => {
    return getAsset(uuid as string);
  }, [uuid]);

  console.log({ asset });
  return <pre>{JSON.stringify(asset, null, 2)}</pre>;
};

export default Assets;
