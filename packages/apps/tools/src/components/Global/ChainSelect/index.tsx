import type { ChainwebChainId } from '@kadena/chainweb-node-client';
import { CHAINS } from '@kadena/chainweb-node-client';
import { MonoLink } from '@kadena/kode-icons/system';
import type { ISelectProps } from '@kadena/kode-ui';
import { Select, SelectItem } from '@kadena/kode-ui';
import type { ChainId } from '@kadena/types';
import type { FC } from 'react';
import React, { useCallback, useState } from 'react';

export type OnChainSelectChange = (value: ChainwebChainId) => void;

// eslint-disable-next-line @kadena-dev/typedef-var
const ELEMENT_ID = 'select-chain-id';

interface ChainSelectProps
  extends Omit<
    ISelectProps,
    'onSelectionChange' | 'selectedKey' | 'defaultSelectedKey' | 'children'
  > {
  onSelectionChange?: OnChainSelectChange;
  selectedKey?: ChainwebChainId;
  defaultSelectedKey?: ChainwebChainId;
  additionalInfoOptions?: any[];
  chainCount?: number;
  chainCountStart?: number;
}
const ChainSelect: FC<ChainSelectProps> = ({
  onSelectionChange,
  additionalInfoOptions,
  id,
  chainCount = CHAINS.length,
  chainCountStart = 0,
  ...rest
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [chains, _] = useState(
    Array.from({ length: chainCount }, (_, i) => i + chainCountStart),
  );
  const onSelectChange = useCallback(
    (selectedKey: string | number) => {
      onSelectionChange?.((selectedKey as ChainId)!);
    },
    [onSelectionChange],
  );

  return (
    <Select
      {...rest}
      label="Chain ID"
      id={id ?? ELEMENT_ID}
      onSelectionChange={onSelectChange}
      startVisual={<MonoLink />}
      aria-label="Select Chain ID"
    >
      {chains.map((chainId, index) => (
        <SelectItem key={chainId} textValue={`${chainId}`}>
          <span style={{ marginInlineEnd: '16px' }}>{chainId}</span>
          {additionalInfoOptions && additionalInfoOptions.length ? (
            <span>{` (${additionalInfoOptions[index].data})`}</span>
          ) : null}
        </SelectItem>
      ))}
    </Select>
  );
};

export { ChainSelect };
