import { Breadcrumbs } from '@/Components/Breadcrumbs/Breadcrumbs';
import { ListItem } from '@/Components/ListItem/ListItem';
import { networkRepository } from '@/modules/network/network.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { MonoWifiTethering } from '@kadena/kode-icons/system';
import { Button, Heading, Stack, Text } from '@kadena/kode-ui';
import { SideBarBreadcrumbsItem, useLayout } from '@kadena/kode-ui/patterns';
import { useState } from 'react';
import { panelClass } from '../home/style.css';
import {
  getNewNetwork,
  INetworkWithOptionalUuid,
  NetworkForm,
} from './Components/NetworkForm';

export function Networks() {
  const { networks } = useWallet();
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useLayout();
  const [selectedNetwork, setSelectedNetwork] =
    useState<INetworkWithOptionalUuid>(() => getNewNetwork());

  return (
    <>
      <Breadcrumbs icon={<MonoWifiTethering />}>
        <SideBarBreadcrumbsItem href="/">Dashboard</SideBarBreadcrumbsItem>
        <SideBarBreadcrumbsItem href="/networks">
          Networks
        </SideBarBreadcrumbsItem>
      </Breadcrumbs>

      <Stack margin="md" flexDirection={'column'}>
        <NetworkForm
          isOpen={isRightAsideExpanded}
          onClose={() => {
            setIsRightAsideExpanded(false);
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
            setIsRightAsideExpanded(false);
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
                setTimeout(() => {
                  setIsRightAsideExpanded(true);
                }, 0);
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
                      setTimeout(() => {
                        setIsRightAsideExpanded(true);
                      }, 0);
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
