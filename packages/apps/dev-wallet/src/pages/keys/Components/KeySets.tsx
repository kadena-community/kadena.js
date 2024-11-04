import { ListItem } from '@/Components/ListItem/ListItem';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { shorten } from '@/utils/helpers';
import { MonoKey } from '@kadena/kode-icons/system';
import { Button, Heading, Stack, Text } from '@kadena/kode-ui';
import { useLayout } from '@kadena/kode-ui/patterns';
import { createPortal } from 'react-dom';
import { CreateKeySetForm } from './CreateKeySetForm';

export function KeySets() {
  const { handleSetAsideExpanded, isAsideExpanded, asideRef } = useLayout();
  const { keysets } = useWallet();
  return (
    <>
      {isAsideExpanded &&
        asideRef &&
        createPortal(
          <CreateKeySetForm close={() => handleSetAsideExpanded(false)} />,
          asideRef,
        )}
      <Stack flexDirection={'column'}>
        <Stack marginBlock={'md'} justifyContent={'space-between'}>
          <Heading variant="h3">Key Sets</Heading>
          <Button
            onPress={() => handleSetAsideExpanded(true)}
            variant="outlined"
            isCompact
          >
            Create Key Set
          </Button>
        </Stack>
        <Stack flexDirection={'column'}>
          {keysets
            .filter(({ guard }) => guard.keys.length >= 2)
            .map((keySet) => (
              <ListItem>
                <Stack justifyContent={'space-between'}>
                  <Stack key={keySet.uuid} gap={'sm'}>
                    <Text>{keySet.alias}</Text>
                    <Text>{keySet.principal}</Text>
                  </Stack>
                </Stack>
                <Stack gap={'md'}>
                  <Text>{keySet.guard.pred}:</Text>
                  {keySet.guard.keys.map((key) => (
                    <Stack gap={'xs'} alignItems={'center'}>
                      <Text>
                        <MonoKey />
                      </Text>
                      <Text variant="code">{shorten(key)}</Text>{' '}
                    </Stack>
                  ))}
                </Stack>
              </ListItem>
            ))}
        </Stack>
      </Stack>
    </>
  );
}
