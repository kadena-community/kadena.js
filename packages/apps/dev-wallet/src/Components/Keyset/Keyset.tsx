import { IKeySet } from '@/modules/account/account.repository';
import { shorten } from '@/utils/helpers';
import { MonoKey } from '@kadena/kode-icons/system';
import { Stack, Text } from '@kadena/kode-ui';

export function Keyset({
  keySet,
  flexDirection = 'row',
}: {
  keySet: IKeySet;
  flexDirection?: 'column' | 'row';
}) {
  return (
    <Stack flexDirection={flexDirection} gap="md" flex={1}>
      <Stack
        key={keySet.uuid}
        gap={'sm'}
        alignItems={'flex-start'}
        flexDirection={flexDirection}
      >
        {keySet.alias && <Text>{keySet.alias}</Text>}
        <Text>{shorten(keySet.principal, 15)}</Text>
      </Stack>

      <Stack gap={'md'} flexDirection={flexDirection} alignItems={'flex-start'}>
        <Text>{keySet.guard.pred}:</Text>
        {keySet.guard.keys.map((key) => (
          <Stack gap={'xs'} alignItems={'center'}>
            <Text>
              <MonoKey />
            </Text>
            <Text variant="code">{shorten(key)}</Text>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
