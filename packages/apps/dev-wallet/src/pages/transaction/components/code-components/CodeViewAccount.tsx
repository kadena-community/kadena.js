import { useWallet } from '@/modules/wallet/wallet.hook';
import { shorten } from '@/utils/helpers';
import { Badge, Stack, Text } from '@kadena/kode-ui';
import { FC } from 'react';

export const CodeViewAccount: FC<{
  address: string;
  contract: string;
}> = ({ address, contract }) => {
  const { getAccountAlias } = useWallet();

  const value = address.replace(/"/gi, '');
  const alias = getAccountAlias(value, contract);
  const shortAddress = shorten(value, 20);
  if (!alias) return shortAddress;
  return (
    <Stack gap={'sm'} flexWrap="wrap">
      <Badge size="sm">{alias}</Badge>
      <Text bold color="emphasize">
        {shortAddress}
      </Text>
    </Stack>
  );
};
