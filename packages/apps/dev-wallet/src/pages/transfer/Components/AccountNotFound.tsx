import { shorten } from '@/utils/helpers';
import { Stack, Text } from '@kadena/kode-ui';
import { FC } from 'react';

export const AccountNotFound: FC<{ address: string }> = ({ address }) => {
  return (
    <Stack flexDirection="column" gap="md" marginBlockEnd="lg">
      <Text color="inherit">
        Address{' '}
        <Text color="inherit" bold>
          {shorten(address)}
        </Text>{' '}
        is not found on the blockchain
      </Text>
      {address.startsWith('w:') && (
        <Text color="inherit">
          The account is probably not found, because it was never used on the
          chain yet. If you want to use this account, make sure it has a
          predicate and at least 2 keys. You can add them below in the form
        </Text>
      )}
    </Stack>
  );
};
