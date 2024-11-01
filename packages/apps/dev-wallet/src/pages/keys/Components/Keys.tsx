import { ListItem } from '@/Components/ListItem/ListItem.tsx';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { createAsideUrl } from '@/utils/createAsideUrl.ts';
import { shorten } from '@/utils/helpers.ts';
import { MonoAdd, MonoMoreVert } from '@kadena/kode-icons/system';
import {
  Button,
  ContextMenu,
  ContextMenuDivider,
  ContextMenuItem,
  Heading,
  Link as LinkUI,
  Stack,
  Text,
} from '@kadena/kode-ui';
import { Link } from 'react-router-dom';
import { panelClass } from '../../home/style.css.ts';

export function Keys() {
  const { keySources, createKey } = useWallet();

  return (
    <>
      <Stack flexDirection={'column'} gap={'lg'}>
        <Stack justifyContent={'space-between'} alignItems={'center'}>
          <Stack marginBlock={'md'}>
            <Heading variant="h3">Your Keys</Heading>
          </Stack>
          <Link to={createAsideUrl('KeySource')}>
            <LinkUI variant="outlined" isCompact>
              Add key Source
            </LinkUI>
          </Link>
        </Stack>

        <Stack flexDirection={'column'} gap="md">
          {keySources.map((keySource) => (
            <Stack
              key={keySource.uuid}
              flexDirection={'column'}
              className={panelClass}
            >
              <Stack
                gap={'lg'}
                justifyContent={'space-between'}
                marginBlockEnd={'sm'}
              >
                <Heading variant="h4">Method: {keySource.source}</Heading>
                <Stack flexDirection={'row'} gap={'sm'}>
                  <Button
                    startVisual={<MonoAdd />}
                    variant="outlined"
                    isCompact
                    onPress={() => createKey(keySource)}
                  >
                    Create Next Key
                  </Button>
                  <ContextMenu
                    placement="bottom end"
                    trigger={
                      <Button
                        endVisual={<MonoMoreVert />}
                        variant="transparent"
                        isCompact
                      />
                    }
                  >
                    {['HD-BIP44', 'HD-chainweaver'].includes(
                      keySource.source,
                    ) ? (
                      <ContextMenuItem
                        label="Create specific key"
                        onClick={() => {}}
                      />
                    ) : (
                      <ContextMenuDivider />
                    )}
                  </ContextMenu>
                </Stack>
              </Stack>
              {keySource.keys.map((key) => (
                <ListItem>
                  <Stack
                    key={key.index}
                    flexDirection={'row'}
                    flex={1}
                    gap={'lg'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                  >
                    <Stack gap={'lg'}>
                      <Text> Index: {key.index}</Text>
                      <Text>{shorten(key.publicKey, 35)}</Text>
                    </Stack>
                    <ContextMenu
                      placement="bottom end"
                      trigger={
                        <Button
                          endVisual={<MonoMoreVert />}
                          variant="transparent"
                          isCompact
                        />
                      }
                    >
                      <ContextMenuItem
                        label="Copy"
                        onClick={() => {
                          navigator.clipboard.writeText(key.publicKey);
                        }}
                      />
                      <ContextMenuItem label="Disable key" onClick={() => {}} />
                    </ContextMenu>
                  </Stack>
                </ListItem>
              ))}
              {(!keySource.keys || keySource.keys.length === 0) && (
                <Text>No keys created yet</Text>
              )}
            </Stack>
          ))}
        </Stack>
      </Stack>
    </>
  );
}
