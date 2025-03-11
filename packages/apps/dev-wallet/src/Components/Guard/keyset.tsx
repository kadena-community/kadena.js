import { useWallet } from '@/modules/wallet/wallet.hook';
import { shorten } from '@/utils/helpers';
import { BuiltInPredicate } from '@kadena/client';
import { MonoKey } from '@kadena/kode-icons/system';
import { Badge, Stack, Text } from '@kadena/kode-ui';
import { useMemo } from 'react';

export const Keyset = ({
  guard,
  alias,
}: {
  guard: { keys: string[]; pred: BuiltInPredicate; principal: string };
  alias?: string;
}) => {
  const { getKeyAlias } = useWallet();
  const keysWithAlias = useMemo(
    () => guard.keys.map((key) => ({ key, alias: getKeyAlias(key) })),
    [getKeyAlias, guard.principal],
  );
  return (
    <Stack
      flexWrap="wrap"
      flexDirection={'row'}
      gap="md"
      paddingInline={'sm'}
      marginBlock={'xs'}
    >
      <Text size="smallest">{guard.pred}:</Text>
      {keysWithAlias.map(({ key, alias }) => (
        <Stack key={key} gap="sm" alignItems={'center'}>
          <Text size="smallest">
            <MonoKey />
          </Text>
          {alias && <Badge size="sm">{alias}</Badge>}
          <Text variant="code" size="smallest">
            {shorten(key!)}
          </Text>
        </Stack>
      ))}
      {alias && (
        <Stack flex={1} justifyContent={'flex-end'}>
          <Badge size="sm">{alias}</Badge>
        </Stack>
      )}
    </Stack>
  );
};
