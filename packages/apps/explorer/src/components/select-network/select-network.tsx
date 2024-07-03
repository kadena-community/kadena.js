import { networkConstants } from '@/constants/network';
import { useRedirectOnNetworkChange } from '@/hooks/network/redirect';
import { Select, SelectItem } from '@kadena/kode-ui';

import type { FC } from 'react';
import React, { useState } from 'react';

const getDefaultSelectedNetwork = (url?: string): string => {
  const foundNetwork = Object.entries(networkConstants).find(([, nw]) =>
    nw.url.includes(process.env.NEXT_PUBLIC_VERCEL_URL ?? ''),
  );

  if (!foundNetwork) return 'mainnet01';
  return foundNetwork[0] ?? 'mainnet01';
};

const SelectNetwork: FC = () => {
  const [selectedNetwork, setSelectedNetwork] = useState(
    getDefaultSelectedNetwork(process.env.NEXT_PUBLIC_VERCEL_URL),
  );

  useRedirectOnNetworkChange(selectedNetwork);

  const handleSelect = (value: any): void => {
    const key = value.toString() as keyof typeof networkConstants;
    const network = networkConstants[key];

    setSelectedNetwork(key);
    window.location = network.url as unknown as Location;
  };

  return (
    <Select
      size="lg"
      aria-label="Select network"
      defaultSelectedKey={selectedNetwork}
      fontType="code"
      onSelectionChange={handleSelect}
    >
      <SelectItem
        key={networkConstants.mainnet01.key}
        textValue={networkConstants.mainnet01.label}
      >
        {networkConstants.mainnet01.label}
      </SelectItem>
      <SelectItem
        key={networkConstants.testnet04.key}
        textValue={networkConstants.testnet04.label}
      >
        {networkConstants.testnet04.label}
      </SelectItem>
    </Select>
  );
};

export default SelectNetwork;
