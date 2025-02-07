import { useWallet } from '@/modules/wallet/wallet.hook';
import { shorten } from '@/utils/helpers';
import { BuiltInPredicate } from '@kadena/client';
import { MonoKey } from '@kadena/kode-icons/system';
import { Badge, Checkbox, Stack, Text } from '@kadena/kode-ui';

export const KeySelector = ({
  guard,
  onSelect,
  selectedKeys,
}: {
  guard: { keys: string[]; pred: BuiltInPredicate };
  onSelect: (keys: string[]) => void;
  selectedKeys: string[];
}) => {
  const { getKeyAlias } = useWallet();
  const keysWithAlias = guard.keys.map((key) => ({
    key,
    alias: getKeyAlias(key),
  }));
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
            <Checkbox
              isSelected={selectedKeys.includes(key)}
              onChange={(isSelected) => {
                let updated = [...selectedKeys];
                if (isSelected) {
                  updated = [...selectedKeys, key];
                } else {
                  updated = selectedKeys.filter((k) => k !== key);
                }
                onSelect(updated);
              }}
            >
              {(<Text size="smallest">{shorten(key!)}</Text>) as any}
            </Checkbox>
          </Text>
        </Stack>
      ))}
    </Stack>
  );
};
