import { useNetwork } from '@/context/networks-context';
import { Select, SelectItem, Stack } from '@kadena/kode-ui';

import {
  MonoControlPointDuplicate,
  MonoPermScanWifi,
} from '@kadena/kode-icons/system';
import type { FC, FormEventHandler } from 'react';
import React, { useState } from 'react';
import NewNetwork from './new-network';
import { selectWrapperClass } from './style.css';

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
    <Stack className={selectWrapperClass}>
      <Select
        size="lg"
        aria-label="Select network"
        selectedKey={activeNetwork!.slug}
        fontType="code"
        onSelectionChange={handleSelectNetwork}
      >
        {
          networks.map((network) => (
            <SelectItem
              key={network.slug ?? network.label}
              textValue={network.label}
            >
              {network.label}
            </SelectItem>
          )) as any
        }
        <SelectItem key="new">Add Network</SelectItem>
        <SelectItem key="configure">Configure</SelectItem>
      </Select>
      {isOpen && (
        <NewNetwork
          handleOpen={setIsOpen}
          createNetwork={handleCreateNetwork}
        />
      )}
    </Stack>
  );
};

export default SelectNetwork;
