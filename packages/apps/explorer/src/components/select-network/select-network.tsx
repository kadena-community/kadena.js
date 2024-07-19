import { useNetwork } from '@/context/networks-context';
import { MonoSettings } from '@kadena/kode-icons/system';
import { Button, Select, SelectItem, Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import React, { useState } from 'react';
import { ConfigNetwork } from './ConfigNetwork';
import { selectWrapperClass } from './style.css';

const SelectNetwork: FC = () => {
  const { networks, activeNetwork, setActiveNetwork } = useNetwork();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectNetwork = (value: any): void => {
    setActiveNetwork(value);
  };

  if (!networks) return null;

  return (
    <Stack className={selectWrapperClass}>
      <Stack>
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
          <SelectItem key="configure">Configure</SelectItem>
        </Select>
        <Button
          onPress={() => setIsOpen(true)}
          variant="transparent"
          endVisual={<MonoSettings />}
        />
      </Stack>
      {isOpen && <ConfigNetwork handleOpen={setIsOpen} />}
    </Stack>
  );
};

export default SelectNetwork;
