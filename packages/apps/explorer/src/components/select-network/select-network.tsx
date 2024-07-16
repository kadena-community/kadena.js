import { useNetwork } from '@/context/networks-context';
import { Select, SelectItem } from '@kadena/kode-ui';

import type { FC, FormEventHandler } from 'react';
import React, { useState } from 'react';
import NewNetwork from './new-network';

const SelectNetwork: FC = () => {
  const { networks, activeNetwork, setActiveNetwork } = useNetwork();

  const [isOpen, setIsOpen] = useState(false);

  const handleSelectNetwork = (value: any): void => {
    if (value === 'new') {
      setIsOpen(true);
      return;
    }

    setActiveNetwork(value);
  };

  if (!networks) return null;

  const handleCreateNetwork: FormEventHandler<HTMLFormElement> = (e): void => {
    e.preventDefault();

    // set label to identifier if empty

    setIsOpen(false);
  };

  return (
    <>
      <Select
        size="lg"
        aria-label="Select network"
        selectedKey={activeNetwork!.slug}
        fontType="code"
        onSelectionChange={handleSelectNetwork}
      >
        {
          networks.map((network) => (
            <SelectItem key={network.slug} textValue={network.label}>
              {network.label}
            </SelectItem>
          )) as any
        }
        <SelectItem key="new">New Network...</SelectItem>
      </Select>
      {isOpen && (
        <NewNetwork
          handleOpen={setIsOpen}
          createNetwork={handleCreateNetwork}
        />
      )}
    </>
  );
};

export default SelectNetwork;
