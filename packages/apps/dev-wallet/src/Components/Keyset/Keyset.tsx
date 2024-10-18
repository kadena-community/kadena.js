import { IKeySet } from '@/modules/account/account.repository';
import { shorten } from '@/utils/helpers';
import { MonoKey } from '@kadena/kode-icons/system';
import { Stack, Text } from '@kadena/kode-ui';

export function Keyset({ keySet }: { keySet: IKeySet }) {
  return (
    <Stack justifyContent={'space-between'} flex={1}>
      <Stack key={keySet.uuid} gap={'sm'}>
        <Text>{keySet.alias}</Text>
        <Text>{keySet.principal}</Text>
      </Stack>

      <Stack gap={'md'}>
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
