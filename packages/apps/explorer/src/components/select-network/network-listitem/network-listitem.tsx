import type { INetwork } from '@/context/networks-context';
import { MonoRemove } from '@kadena/kode-icons/system';
import { Button, Heading, Stack } from '@kadena/kode-ui';
import classNames from 'classnames';
import type { FC } from 'react';
import React, { useCallback } from 'react';
import { selectedNetworkClass } from '../style.css';

interface IProps {
  network: INetwork;
  selectNetwork: (value: any) => void;
  removeNetwork: (value: INetwork) => void;
  isActive: boolean;
  isDefaultNetwork: boolean;
}
const NetworkListItem: FC<IProps> = ({
  network,
  selectNetwork,
  isActive,
  removeNetwork,
  isDefaultNetwork,
}) => {
  const handleSelect = useCallback(() => {
    selectNetwork(network.networkId);
  }, [network]);

  const handleRemove = useCallback(() => {
    removeNetwork(network);
  }, [network]);
  return (
    <Stack
      as="li"
      alignItems="center"
      className={classNames({ [selectedNetworkClass]: isActive })}
    >
      <Heading as="h5">{network.label}</Heading>
      <Stack flex={1} />
      <Stack gap="xs">
        {!isDefaultNetwork && (
          <Button variant="outlined" onPress={handleRemove}>
            <MonoRemove />
          </Button>
        )}
        <Button variant="outlined" onPress={handleSelect}>
          Select
        </Button>
      </Stack>
    </Stack>
  );
};

export default NetworkListItem;
