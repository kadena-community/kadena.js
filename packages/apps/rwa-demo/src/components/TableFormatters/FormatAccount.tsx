import { maskValue, Stack, Text } from '@kadena/kode-ui';
import type { ICompactTableFormatterProps } from '@kadena/kode-ui/patterns';
import React, { useState } from 'react';
import { TransactionPendingIcon } from '../TransactionPendingIcon/TransactionPendingIcon';

export interface IActionProps {}

export const FormatAccount = () => {
  const Component = ({ value }: ICompactTableFormatterProps) => {
    const [isPending] = useState<boolean>(true);
    const [displayName] = useState<string>('');

    return (
      <Stack flexDirection="column" gap="xs">
        <Text>{isPending ? <TransactionPendingIcon /> : displayName}</Text>
        <Text variant="code">{maskValue(`${value}`)}</Text>
      </Stack>
    );
  };
  return Component;
};
