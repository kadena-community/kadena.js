import { ConfirmDeletion } from '@/Components/ConfirmDeletion/ConfirmDeletion';
import { ListItem } from '@/Components/ListItem/ListItem';
import { usePrompt } from '@/Components/PromptProvider/Prompt';
import { SideBarBreadcrumbs } from '@/Components/SideBarBreadcrumbs/SideBarBreadcrumbs';
import { dbService } from '@/modules/db/db.service';
import {
  INetwork,
  networkRepository,
} from '@/modules/network/network.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { MonoDelete, MonoWifiTethering } from '@kadena/kode-icons/system';
import { Button, Heading, Stack, Text } from '@kadena/kode-ui';
import {
  SideBarBreadcrumbsItem,
  useSideBarLayout,
} from '@kadena/kode-ui/patterns';
import { useEffect, useState } from 'react';
import { panelClass } from '../home/style.css';
import {
  getNewNetwork,
  INetworkWithOptionalUuid,
  NetworkForm,
} from './Components/NetworkForm';

export function Networks() {
  const prompt = usePrompt();
  const { setActiveNetwork, activeNetwork } = useWallet();
  const [networks, setNetworks] = useState<INetwork[]>([]);
  const { setIsRightAsideExpanded, isRightAsideExpanded } = useSideBarLayout();
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
  }, []);

  return (
    <>
      <SideBarBreadcrumbs icon={<MonoWifiTethering />} isGlobal>
        <SideBarBreadcrumbsItem href="/networks">
          Network settings
        </SideBarBreadcrumbsItem>
      </SideBarBreadcrumbs>

      <Stack margin="md" flexDirection={'column'}>
        <NetworkForm
          isOpen={isRightAsideExpanded}
          onClose={() => {
            setIsRightAsideExpanded(false);
            setSelectedNetwork(getNewNetwork());
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
            setSelectedNetwork(getNewNetwork());
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
            <Heading as="h4">Network settings</Heading>

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
                  <Button
                    isCompact
                    isDisabled={networks.length === 1}
                    variant="transparent"
                    onPress={async () => {
                      // don't allow to delete the last network
                      if (networks.length === 1) {
                        await prompt((resolve) => {
                          return (
                            <ConfirmDeletion
                              onCancel={() => resolve(resolve)}
                              onDelete={() => resolve(true)}
                              deleteText=""
                              cancelText="Close"
                              title="Alert"
                              description={`You can't delete the last network`}
                            />
                          );
                        });
                        return;
                      }
                      const confirm = await prompt((resolve) => {
                        return (
                          <ConfirmDeletion
                            onCancel={() => resolve(false)}
                            onDelete={() => resolve(true)}
                            title="Delete Network"
                            description={`Are you sure you want to delete ${network.name ?? network.networkId}? All funds and transactions will be hide from the UI. You can always add it back`}
                          />
                        );
                      });
                      if (!confirm) {
                        return;
                      }
                      networkRepository.deleteNetwork(network.uuid);
                      if (activeNetwork?.uuid === network.uuid) {
                        const nextNetwork = networks.find(
                          ({ uuid }) => uuid !== network.uuid,
                        );
                        if (nextNetwork) {
                          setActiveNetwork(nextNetwork);
                        }
                      }
                    }}
                  >
                    <MonoDelete />
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
