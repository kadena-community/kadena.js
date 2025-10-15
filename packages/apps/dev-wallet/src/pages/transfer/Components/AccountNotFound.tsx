import { shorten } from '@/utils/helpers';
import { Stack, Text } from '@kadena/kode-ui';
import { FC } from 'react';

export const AccountNotFound: FC<{ address: string }> = ({ address }) => {
  return (
    <Stack flexDirection="column" gap="md" marginBlockEnd="lg">
      <Text color="inherit">
        The signing keys for{' '}
        <Text color="inherit" bold>
          {shorten(address)}
        </Text>{' '}
        weren’t found on the blockchain.
      </Text>
      {address.startsWith('w:') && (
        <Text color="inherit">
          If this is the first time you’re using the account on the target
          chain, add all of its signing keys and select an appropriate predicate
          to continue.
        </Text>
      )}
    </Stack>
  );
};
