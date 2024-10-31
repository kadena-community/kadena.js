import { ListItem } from '@/Components/ListItem/ListItem';
import { networkRepository } from '@/modules/network/network.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { Mono123, MonoWifiTethering } from '@kadena/kode-icons/system';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  Heading,
  Stack,
  Text,
} from '@kadena/kode-ui';
import { useSideBar } from '@kadena/kode-ui/patterns';
import { useEffect, useState } from 'react';
import { panelClass } from '../home/style.css';
import {
  INetworkWithOptionalUuid,
  NetworkForm,
} from './Components/network-form';

const getNewNetwork = (): INetworkWithOptionalUuid => ({
  uuid: undefined,
  networkId: '',
  name: '',
  hosts: [
    {
      url: '',
      submit: false,
      read: false,
      confirm: false,
    },
  ],
});

export function Networks() {
  const { networks } = useWallet();
  const { setAppContext, setBreadCrumbs } = useSideBar();
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [selectedNetwork, setSelectedNetwork] =
    useState<INetworkWithOptionalUuid>(() => getNewNetwork());

  useEffect(() => {
    setAppContext({
      visual: <Mono123 />,
      label: 'test',
      onPress: () => alert(111),
    });

    setBreadCrumbs([
      { label: 'Networks', visual: <MonoWifiTethering />, url: '/networks' },
    ]);
  }, []);
  return (
    <>
      <Stack margin="md" flexDirection={'column'}>
        <Dialog
          isOpen={showNetworkModal}
          onOpenChange={setShowNetworkModal}
          size="sm"
        >
          <DialogHeader>Add Network</DialogHeader>
          <DialogContent>
            <NetworkForm
              onSave={async (updNetwork) => {
                if (updNetwork.uuid) {
                  await networkRepository.updateNetwork(updNetwork);
                } else {
                  await networkRepository.addNetwork({
                    ...updNetwork,
                    uuid: crypto.randomUUID(),
                  });
                }
                setShowNetworkModal(false);
              }}
              network={selectedNetwork}
            />
          </DialogContent>
        </Dialog>
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
                setShowNetworkModal(true);
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
                      setShowNetworkModal(true);
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
