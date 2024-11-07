import { ListItem } from '@/Components/ListItem/ListItem';
import { FormatKeys } from '@/Components/Table/FormatKeys';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { shorten } from '@/utils/helpers';
import { MonoKey } from '@kadena/kode-icons/system';
import { Button, Heading, Stack, Text } from '@kadena/kode-ui';
import { CompactTable, useLayout } from '@kadena/kode-ui/patterns';
import { CreateKeySetForm } from './CreateKeySetForm';

export function KeySets() {
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useLayout();
  const { keysets } = useWallet();
  return (
    <>
      <CreateKeySetForm
        isOpen={isRightAsideExpanded}
        close={() => setIsRightAsideExpanded(false)}
      />
      <Stack flexDirection={'column'}>
        <Stack marginBlock={'md'} justifyContent={'space-between'}>
          <Heading variant="h5">Key Sets</Heading>
          <Button
            onPress={() => setIsRightAsideExpanded(true)}
            variant="outlined"
            isCompact
          >
            Create Key Set
          </Button>
        </Stack>
        <CompactTable
          fields={[
            {
              label: 'Alias',
              key: 'alias',
              width: '10%',
            },
            {
              label: 'Principal',
              key: 'principal',
              width: '45%',
            },
            {
              label: 'Keys',
              key: ['guard.pred', 'guard.keys'],
              variant: 'code',
              width: '45%',
              render: FormatKeys(),
            },
          ]}
          data={keysets.filter(({ guard }) => guard.keys.length >= 2)}
        />
      </Stack>
    </>
  );
}
