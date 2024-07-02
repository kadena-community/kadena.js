import type { ISelectProps } from '@kadena/kode-ui';
import { Select, SelectItem } from '@kadena/kode-ui';
import type { FC } from 'react';
import React, { useCallback } from 'react';

export type PredKey = 'keys-all' | 'keys-any' | 'keys-2';

export type OnPredSelectChange = (value: PredKey) => void;

const ELEMENT_ID = 'select-pred';

const predicates: Array<PredKey> = ['keys-all', 'keys-any', 'keys-2'];
interface IPredKeysSelectProps
  extends Omit<ISelectProps, 'onSelectionChange' | 'selectedKey' | 'children'> {
  onSelectionChange?: OnPredSelectChange;
  selectedKey?: PredKey;
}

const PredKeysSelect: FC<IPredKeysSelectProps> = ({
  selectedKey,
  onSelectionChange,
  ...rest
}) => {
  const onSelectChange = useCallback(
    (key: string | number) => {
      const pred = predicates.find((pred) => {
        return pred === key;
      });

      onSelectionChange?.(pred!);
    },
    [onSelectionChange],
  );

  return (
    <Select
      {...rest}
      id={ELEMENT_ID}
      label="Predicate"
      onSelectionChange={onSelectChange}
      selectedKey={selectedKey}
      aria-label="Select Predicate"
    >
      {predicates.map((pred) => (
        <SelectItem key={pred}>{pred}</SelectItem>
      ))}
    </Select>
  );
};

export { PredKeysSelect };
