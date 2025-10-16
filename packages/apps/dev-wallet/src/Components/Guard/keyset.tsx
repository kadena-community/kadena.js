import { useWallet } from '@/modules/wallet/wallet.hook';
import { shorten } from '@/utils/helpers';
import { BuiltInPredicate } from '@kadena/client';
import { Badge, Stack, Text } from '@kadena/kode-ui';
import { useMemo } from 'react';
import { keyClass } from './style.css';

export const Keyset = ({
  guard,
  alias,
  hidePred,
  direction = 'row',
}: {
  guard: { keys: string[]; pred: BuiltInPredicate; principal: string };
  alias?: string;
  hidePred?: boolean;
  direction?: 'column' | 'row';
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
      width="100%"
    >
      <Stack width="100%" gap="xs" flexDirection={direction}>
        {!hidePred && (
          <Stack style={{ width: '75px' }}>
            <Badge size="sm" style="highContrast">
              {guard.pred}
            </Badge>
          </Stack>
        )}
        <Stack flexWrap="wrap" flexDirection={'row'} flex={1}>
          {keysWithAlias.map(({ key, alias }) => (
            <Stack
              key={key}
              gap="sm"
              alignItems={'center'}
              className={keyClass}
              paddingBlockEnd="xs"
            >
              {alias && <Badge size="sm">{alias}</Badge>}
              <Text variant="code" size="smallest">
                {shorten(key!)}
              </Text>
            </Stack>
          ))}
        </Stack>
        {alias && (
          <Stack flex={1} justifyContent={'flex-end'}>
            <Badge size="sm">{alias}</Badge>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};
