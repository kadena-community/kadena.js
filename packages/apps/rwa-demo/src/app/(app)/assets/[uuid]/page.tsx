'use client';

import { useAsset } from '@/hooks/asset';
import { CompactTable, CompactTableFormatters } from '@kadena/kode-ui/patterns';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

const Assets = () => {
  const { handleSelectAsset } = useAsset();
  const { uuid } = useParams();
  const asset = useMemo(() => {
    return handleSelectAsset(uuid);
  }, [uuid]);

  return <>{asset}</>;
};

export default Assets;
