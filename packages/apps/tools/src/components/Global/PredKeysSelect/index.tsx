import type { ISelectProps } from '@kadena/react-ui';
import { FormFieldWrapper, Select } from '@kadena/react-ui';

import type { FC, FormEventHandler } from 'react';
import React, { useCallback } from 'react';

export type PredKey = 'keys-all' | 'keys-any' | 'keys-2';

export type OnPredSelectChange = (value: PredKey) => void;

const ELEMENT_ID = 'select-pred';

const predicates: Array<PredKey> = ['keys-all', 'keys-any', 'keys-2'];

const PredKeysSelect: FC<
  Omit<ISelectProps, 'children' | 'value' | 'onChange' | 'icon' | 'id'> & {
    value: PredKey;
    onChange: OnPredSelectChange;
  }
> = ({ value, onChange, ...rest }) => {
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
    return <option key={`id-${pred}`}>{pred}</option>;
  });

  return (
    <FormFieldWrapper label="Predicate" htmlFor={ELEMENT_ID}>
      <Select
        {...rest}
        id={ELEMENT_ID}
        onChange={onSelectChange}
        value={value}
        ariaLabel="Select Predicate"
      >
        {options}
      </Select>
    </FormFieldWrapper>
  );
};

export { PredKeysSelect };
