import type { ISelectProps } from '@kadena/react-ui';
import { InputWrapper, Select } from '@kadena/react-ui';

import type { FC, FormEventHandler } from 'react';
import React, { useCallback } from 'react';

export type PredKey = 'keys-all' | 'keys-any' | 'keys-2';

export type OnChainSelectChange = (value: PredKey) => void;

// eslint-disable-next-line @kadena-dev/typedef-var
const ELEMENT_ID = 'select-pred';

const PredKeysSelect: FC<
  Omit<ISelectProps, 'children' | 'value' | 'onChange' | 'icon' | 'id'> & {
    value: PredKey;
    onChange: OnChainSelectChange;
  }
> = ({ value, onChange, ...rest }) => {
  const predicates: Array<PredKey> = ['keys-all', 'keys-any', 'keys-2'];

  const onSelectChange = useCallback<FormEventHandler<HTMLSelectElement>>(
    (e) => {
      const pred = predicates.find((pred) => {
        return pred === e.currentTarget.value;
      });

      onChange(pred!);
    },
    [onChange],
  );

  const options = predicates.map((pred) => {
    return <option key={`chain-id-${pred}`}>{pred}</option>;
  });

  return (
    <InputWrapper label="Pred" htmlFor={ELEMENT_ID}>
      <Select
        {...rest}
        id={ELEMENT_ID}
        onChange={onSelectChange}
        value={value}
        ariaLabel="Select Pred"
      >
        {options}
      </Select>
    </InputWrapper>
  );
};

export { PredKeysSelect };
