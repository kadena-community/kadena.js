import { ButtonItem } from '@/Components/ButtonItem/ButtonItem';
import { Keyset } from '@/Components/Keyset/Keyset';
import { IKeySet } from '@/modules/account/account.repository';
import { Stack } from '@kadena/kode-ui';

export function KeysetList({
  keysets,
  onSelect,
  flexDirection = 'column',
}: {
  keysets: Array<IKeySet & { used: boolean }>;
  onSelect: (keyset: IKeySet) => void;
  flexDirection?: 'column' | 'row';
}) {
  return keysets.map((keyset) => {
    return (
      <Stack gap={'sm'} alignItems={'center'}>
        <ButtonItem
          key={keyset.uuid}
          disabled={Boolean(keyset.used)}
          onClick={() => {
            if (!keyset.used) {
              onSelect(keyset);
            }
          }}
        >
          <Stack gap={'md'} justifyContent={'center'} alignItems={'center'}>
            <Stack flex={1} gap={'sm'}>
              {<Keyset keySet={keyset} flexDirection={flexDirection} />}
            </Stack>
          </Stack>
        </ButtonItem>
      </Stack>
    );
  });
}
