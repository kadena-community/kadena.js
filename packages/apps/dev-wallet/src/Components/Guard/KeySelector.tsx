import { shorten } from '@/utils/helpers';
import { BuiltInPredicate } from '@kadena/client';
import { MonoKey } from '@kadena/kode-icons/system';
import { Checkbox, Stack, Text } from '@kadena/kode-ui';

export const KeySelector = ({
  guard,
  onSelect,
  selectedKeys,
}: {
  guard: { keys: string[]; pred: BuiltInPredicate };
  onSelect: (keys: string[]) => void;
  selectedKeys: string[];
}) => {
  return (
    <Stack
      flexWrap="wrap"
      flexDirection={'row'}
      gap="md"
      paddingInline={'sm'}
      marginBlock={'xs'}
    >
      <Text size="smallest">{guard.pred}:</Text>
      {guard.keys.map((key) => (
        <Stack key={key} gap="sm" alignItems={'center'}>
          <Text size="smallest">
            <MonoKey />
          </Text>
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
              {shorten(key!)}
            </Checkbox>
          </Text>
        </Stack>
      ))}
    </Stack>
  );
};
