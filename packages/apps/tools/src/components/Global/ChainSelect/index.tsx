import type { ChainwebChainId } from '@kadena/chainweb-node-client';
import { CHAINS } from '@kadena/chainweb-node-client';
import type { ISelectProps } from '@kadena/react-ui';
import { Select, SelectItem, SystemIcon } from '@kadena/react-ui';
import type { FC } from 'react';
import React, { useCallback } from 'react';

export type OnChainSelectChange = (value: ChainwebChainId) => void;

// eslint-disable-next-line @kadena-dev/typedef-var
const ELEMENT_ID = 'select-chain-id';

interface ChainSelectProps
  extends Omit<ISelectProps, 'onSelectionChange' | 'selectedKey' | 'children'> {
  onSelectionChange?: OnChainSelectChange;
  selectedKey?: ChainwebChainId;
  additionalInfoOptions?: any[];
}
const ChainSelect: FC<ChainSelectProps> = ({
  selectedKey,
  onSelectionChange,
  additionalInfoOptions,
  ...rest
}) => {
  const onSelectChange = useCallback(
    (selectedKey: string | number) => {
      const chainId = CHAINS.find((chainId) => {
        return chainId === selectedKey;
      });

      onSelectionChange?.(chainId!);
    },
    [onSelectionChange],
  );

  return (
    <Select
      {...rest}
      label="Chain ID"
      id={ELEMENT_ID}
      onSelectionChange={onSelectChange}
      selectedKey={selectedKey}
      startIcon={<SystemIcon.Link />}
      aria-label="Select Chain ID"
    >
      {CHAINS.map((chainId, index) => (
        <SelectItem key={chainId}>
          <span>{chainId}</span>
          {additionalInfoOptions && additionalInfoOptions.length ? (
            <span>{` (${additionalInfoOptions[index].data})`}</span>
          ) : null}
        </SelectItem>
      ))}
    </Select>
  );
};

export { ChainSelect };
