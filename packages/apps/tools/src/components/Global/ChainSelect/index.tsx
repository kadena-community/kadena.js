import type { ChainwebChainId } from '@kadena/chainweb-node-client';
import { CHAINS } from '@kadena/chainweb-node-client';
import type { ISelectProps } from '@kadena/react-ui';
import { InputWrapper, Select } from '@kadena/react-ui';

import type { FC, FormEventHandler } from 'react';
import React, { useCallback } from 'react';

export type OnChainSelectChange = (value: ChainwebChainId | '') => void;

// eslint-disable-next-line @kadena-dev/typedef-var
const ELEMENT_ID = 'select-chain-id';

const ChainSelect: FC<
  Omit<ISelectProps, 'children' | 'value' | 'onChange' | 'icon' | 'id'> & {
    value: ChainwebChainId | '';
    onChange: OnChainSelectChange;
    includeEmpty?: boolean;
  }
> = ({ value, onChange, includeEmpty = false, ...rest }) => {
  const onSelectChange = useCallback<FormEventHandler<HTMLSelectElement>>(
    (e) => {
      let selectedValue: ChainwebChainId | '' = '';

      const chainId = CHAINS.find((chainId) => {
        return chainId === e.currentTarget.value;
      });

      if (chainId) {
        selectedValue = chainId;
      }

      onChange(selectedValue);
    },
    [onChange],
  );

  const values: Array<ChainwebChainId | ''> = [...CHAINS];

  if (includeEmpty) {
    values.unshift('');
  }

  const options = values.map((chainID) => {
    return (
      <option key={`chain-id-${chainID}`} value={chainID}>
        {chainID}
      </option>
    );
  });

  return (
    <InputWrapper label="Chain ID" htmlFor={ELEMENT_ID}>
      <Select
        {...rest}
        id={ELEMENT_ID}
        onChange={onSelectChange}
        value={value}
        icon={'Link'}
        ariaLabel="Select Chain ID"
      >
        {options}
      </Select>
    </InputWrapper>
  );
};

export { ChainSelect };
