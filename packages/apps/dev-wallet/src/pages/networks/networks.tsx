import { ListItem } from '@/Components/ListItem/ListItem';
import { networkRepository } from '@/modules/network/network.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { createAsideUrl } from '@/utils/createAsideUrl';
import { MonoWifiTethering, MonoWorkspaces } from '@kadena/kode-icons/system';
import { Button, Heading, Link, Stack, Text } from '@kadena/kode-ui';
import { useLayout } from '@kadena/kode-ui/patterns';
import { useState } from 'react';
import { panelClass } from '../home/style.css';
import {
  getNewNetwork,
  INetworkWithOptionalUuid,
  NetworkForm,
} from './Components/NetworkForm';

export function Networks() {
  const { networks } = useWallet();
  const { handleSetAsideExpanded, isAsideExpanded } = useLayout();
  const [selectedNetwork, setSelectedNetwork] =
    useState<INetworkWithOptionalUuid>(() => getNewNetwork());
  useLayout({
    appContext: {
      visual: <MonoWorkspaces />,
      label: 'Add Network',
      href: createAsideUrl('KeySource'),
      component: Link,
    },
    breadCrumbs: [
      { label: 'Networks', visual: <MonoWifiTethering />, url: '/networks' },
    ],
  });

  return (
    <>
      <Stack margin="md" flexDirection={'column'}>
        <NetworkForm
          isOpen={isAsideExpanded}
          onClose={() => {
            handleSetAsideExpanded(false);
          }}
          onSave={async (updNetwork) => {
            if (updNetwork.uuid) {
              await networkRepository.updateNetwork(updNetwork);
            } else {
              await networkRepository.addNetwork({
                ...updNetwork,
                uuid: crypto.randomUUID(),
              });
            }
            handleSetAsideExpanded(false);
          }}
          network={selectedNetwork}
        />

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

            <Button
              variant="outlined"
              isCompact
              onPress={() => {
                setSelectedNetwork(getNewNetwork());
                handleSetAsideExpanded(true);
              }}
            >
              Add Network
            </Button>
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
                  <Button
                    isCompact
                    variant="outlined"
                    onPress={() => {
                      setSelectedNetwork(network);
                      handleSetAsideExpanded(true);
                    }}
                  >
                    Edit
                  </Button>
                </Stack>
              </Stack>
            </ListItem>
          ))}
        </Stack>
      </Stack>
    </>
  );
}
