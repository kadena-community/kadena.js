import type { INetwork } from '@/context/networks-context';
import { useNetwork } from '@/context/networks-context';
import { Button, Select, SelectItem, Stack } from '@kadena/kode-ui';

import { MonoSettings } from '@kadena/kode-icons/system';
import type { FC, FormEventHandler } from 'react';
import React, { useState } from 'react';
import { Media } from '../layout/media';
import NewNetwork from './new-network';

const SelectNetwork: FC = () => {
  const { networks, activeNetwork, setActiveNetwork, removeNetwork } =
    useNetwork();

  const [isOpen, setIsOpen] = useState(false);

  const handleRemoveNetwork = (network: INetwork): void => {
    removeNetwork(network);
    setIsOpen(false);
  };
  const handleSelectNetwork = (value: any): void => {
    setActiveNetwork(value);
    setIsOpen(false);
  };

  if (!networks) return null;

  const handleCreateNetwork: FormEventHandler<HTMLFormElement> = (e): void => {
    e.preventDefault();

    // set label to identifier if empty

    setIsOpen(false);
  };

  return (
    <>
      <Stack alignItems="center" gap="xs">
        <Media greaterThanOrEqual="md">
          <Select
            size="lg"
            aria-label="Select network"
            selectedKey={activeNetwork!.networkId}
            fontType="code"
            onSelectionChange={handleSelectNetwork}
          >
            {
              networks.map((network) => (
                <SelectItem key={network.networkId} textValue={network.label}>
                  {network.label}
                </SelectItem>
              )) as any
            }
          </Select>
        </Media>

        <Button variant="transparent" onPress={() => setIsOpen(true)}>
          <MonoSettings />
        </Button>
      </Stack>

      {isOpen && (
        <NewNetwork
          removeNetwork={handleRemoveNetwork}
          selectNetwork={handleSelectNetwork}
          handleOpen={setIsOpen}
          createNetwork={handleCreateNetwork}
        />
      )}
    </>
  );
};

export default SelectNetwork;
