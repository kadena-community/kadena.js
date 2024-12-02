'use client';

import { useAsset } from '@/hooks/asset';
import { CompactTable, CompactTableFormatters } from '@kadena/kode-ui/patterns';
import Link from 'next/link';

const Assets = () => {
  const { assets } = useAsset();

  return (
    <>
      <CompactTable
        fields={[
          {
            key: 'uuid',
            label: 'id',
            width: '40%',
            render: CompactTableFormatters.FormatLink({
              linkComponent: Link,
              url: '/assets/:value',
            }),
          },
          {
            key: 'name',
            label: 'name',
            width: '60%',
          },
        ]}
        data={assets}
      />
    </>
  );
};

export default Assets;
