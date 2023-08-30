import { CHAINS, ChainwebChainId } from '@kadena/chainweb-node-client';
import {
  InputWrapper,
  Option,
  Select,
  type ISelectProps,
} from '@kadena/react-ui';

import { useCallback, type FC, type FormEventHandler } from 'react';

export type OnChainSelectChange = (value: ChainwebChainId) => void;

// eslint-disable-next-line @kadena-dev/typedef-var
const ELEMENT_ID = 'select-chain-id';

const ChainSelect: FC<
  Omit<ISelectProps, 'children' | 'value' | 'onChange' | 'icon' | 'id'> & {
    value: ChainwebChainId;
    onChange: OnChainSelectChange;
  }
> = ({ value, onChange, ...rest }) => {
  const onSelectChange = useCallback<FormEventHandler<HTMLSelectElement>>(
    (e) => {
      const chainId = CHAINS.find((chainId) => {
        return chainId === e.currentTarget.value;
      });

      onChange(chainId!);
    },
    [onChange],
  );

  const options = CHAINS.map((chainID) => {
    return <Option key={`chain-id-${chainID}`}>{chainID}</Option>;
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
