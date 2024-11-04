import { shorten } from '@/utils/helpers';
import { BuiltInPredicate, ISigner } from '@kadena/client';
import { MonoKey } from '@kadena/kode-icons/system';
import { Stack, Text } from '@kadena/kode-ui';

export const Keyset = ({
  guard,
}: {
  guard: { keys: ISigner[]; pred: BuiltInPredicate };
}) => (
  <Stack
    flexWrap="wrap"
    flexDirection={'row'}
    gap="md"
    paddingInline={'md'}
    marginBlock={'xs'}
  >
    <Text size="smallest">{guard.pred}:</Text>
    {guard.keys
      .map((key) => (typeof key === 'string' ? key : key.pubKey))
      .filter((key) => key !== '')
      .map((key) => (
        <Stack key={key} gap="sm" alignItems={'center'}>
          <Text size="smallest">
            <MonoKey />
          </Text>
          <Text variant="code" size="smallest">
            {shorten(key!)}
          </Text>
        </Stack>
      ))}
  </Stack>
);
