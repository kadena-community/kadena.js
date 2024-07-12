import type { INetwork } from '@/context/networks-context';
import { MonoRemove } from '@kadena/kode-icons/system';
import { Button, Heading, Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import React, { useCallback } from 'react';

interface IProps {
  network: INetwork;
  selectNetwork: (value: any) => void;
}
const NetworkListItem: FC<IProps> = ({ network, selectNetwork }) => {
  const handleSelect = useCallback(() => {
    selectNetwork(network.networkId);
  }, [network]);
  return (
    <Stack as="li" alignItems="center">
      <Heading as="h5">{network.label}</Heading>
      <Stack flex={1} />
      <Stack gap="xs">
        <Button variant="outlined" onPress={handleSelect}>
          Select
        </Button>
        <Button variant="outlined">
          <MonoRemove />
        </Button>
      </Stack>
    </Stack>
  );
};

export default NetworkListItem;
