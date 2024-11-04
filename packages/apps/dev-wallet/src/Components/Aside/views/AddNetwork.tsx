import { networkRepository } from '@/modules/network/network.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import {
  INetworkWithOptionalUuid,
  NetworkForm,
} from '@/pages/networks/Components/network-form';
import { useLayout } from '@kadena/kode-ui/patterns';
import { useMemo } from 'react';

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

const AddNetwork = ({ networkUuid }: { networkUuid: string }) => {
  const { handleSetAsideExpanded } = useLayout();
  const { getNetwork } = useWallet();

  const network = useMemo(() => {
    return getNetwork(networkUuid) ?? getNewNetwork();
  }, [networkUuid]);

  return (
    <>
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
          handleSetAsideExpanded(false);
        }}
        network={network}
      />
    </>
  );
};

export default AddNetwork;
