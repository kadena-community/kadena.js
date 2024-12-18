import { ListItem } from '@/Components/ListItem/ListItem';
import { SideBarBreadcrumbs } from '@/Components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { dbService } from '@/modules/db/db.service';
import {
  INetwork,
  networkRepository,
} from '@/modules/network/network.repository';
import { MonoWifiTethering } from '@kadena/kode-icons/system';
import { Button, Heading, Stack, Text } from '@kadena/kode-ui';
import { SideBarBreadcrumbsItem, useLayout } from '@kadena/kode-ui/patterns';
import { useEffect, useState } from 'react';
import { panelClass } from '../home/style.css';
import {
  getNewNetwork,
  INetworkWithOptionalUuid,
  NetworkForm,
} from './Components/NetworkForm';

export function Networks() {
  const [networks, setNetworks] = useState<INetwork[]>([]);
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useLayout();
  const [selectedNetwork, setSelectedNetwork] =
    useState<INetworkWithOptionalUuid>(() => getNewNetwork());

  useEffect(() => {
    const fetchNetworks = async () => {
      const networks = await networkRepository.getAllNetworks();
      setNetworks(networks);
    };
    fetchNetworks();
    return dbService.subscribe((type, store) => {
      if (store === 'network' && ['add', 'update', 'delete'].includes(type)) {
        fetchNetworks();
      }
    });
  });

  return (
    <>
      <SideBarBreadcrumbs icon={<MonoWifiTethering />}>
        <SideBarBreadcrumbsItem href="/">Dashboard</SideBarBreadcrumbsItem>
        <SideBarBreadcrumbsItem href="/networks">
          Networks
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>

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
