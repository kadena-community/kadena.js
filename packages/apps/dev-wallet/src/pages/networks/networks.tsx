import { ListItem } from '@/Components/ListItem/ListItem';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { createAsideUrl } from '@/utils/createAsideUrl';
import { MonoWifiTethering, MonoWorkspaces } from '@kadena/kode-icons/system';
import { Heading, Link, Link as LinkUI, Stack, Text } from '@kadena/kode-ui';
import { useLayout } from '@kadena/kode-ui/patterns';
import { panelClass } from '../home/style.css';

export function Networks() {
  const { networks } = useWallet();
  useLayout({
    appContext: {
      visual: <MonoWorkspaces />,
      label: 'Add Network',
      href: createAsideUrl('AddNetwork'),
      component: Link,
    },
    breadCrumbs: [
      { label: 'Networks', visual: <MonoWifiTethering />, url: '/networks' },
    ],
  });

  return (
    <>
      <Stack margin="md" flexDirection={'column'}>
        <Stack
          className={panelClass}
          marginBlockStart="xl"
          flexDirection={'column'}
        >
          <Stack
            flexDirection={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            marginBlockEnd={'md'}
          >
            <Heading as="h4">Networks</Heading>

            <LinkUI
              component={Link}
              href={createAsideUrl('AddNetwork')}
              variant="outlined"
              isCompact
            >
              Add Network
            </LinkUI>
          </Stack>
          {networks.map((network) => (
            <ListItem key={network.uuid}>
              <Stack
                gap={'sm'}
                flexDirection={'row'}
                justifyContent={'space-between'}
                flex={1}
              >
                <Text>
                  {network.networkId}
                  {network.name ? ` - ${network.name}` : ''}
                </Text>
                <Stack gap={'sm'} alignItems={'center'}>
                  <Text color="emphasize" bold>
                    {network.hosts[0].url}
                    {network.hosts.length > 1
                      ? ` +${network.hosts.length - 1}`
                      : ''}
                  </Text>
                  <LinkUI
                    component={Link}
                    href={createAsideUrl('AddNetwork', {
                      networkUuid: network.uuid,
                    })}
                    isCompact
                    variant="outlined"
                  >
                    Edit
                  </LinkUI>
                </Stack>
              </Stack>
            </ListItem>
          ))}
        </Stack>
      </Stack>
    </>
  );
}
