import { useAccount } from '@/hooks/account';
import { Badge, Stack } from '@kadena/kode-ui';
import type { ICompactTableFormatterProps } from '@kadena/kode-ui/patterns';
import { CompactTableFormatters } from '@kadena/kode-ui/patterns';
import React, { useEffect, useState } from 'react';

export const FormatAccount = () => {
  const Component = ({ value }: ICompactTableFormatterProps) => {
    const [isInnerOwner, setIsInnerOwner] = useState(false);
    const { account, isOwner } = useAccount();

    useEffect(() => {
      if (!value) return;
      if (account?.address === value && isOwner) {
        setIsInnerOwner(true);
      }
    }, []);

    if (!value) return null;

    return (
      <Stack gap="xs" alignItems="center">
        {CompactTableFormatters.FormatAccount()({ value })}
        {isInnerOwner && <Badge size="sm">owner</Badge>}
      </Stack>
    );
  };

  return Component;
};
