import type { ISelectProps } from '@kadena/react-ui';
import { Select, SelectItem } from '@kadena/react-ui';
import type { FC } from 'react';
import React, { useCallback } from 'react';

export type PredKey = 'keys-all' | 'keys-any' | 'keys-2';

export type OnPredSelectChange = (value: PredKey) => void;

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
      label="Select Predicate"
      onSelectionChange={onSelectChange}
      selectedKey={selectedKey}
    >
      {predicates.map((pred) => (
        <SelectItem key={pred}>{pred}</SelectItem>
      ))}
    </Select>
  );
};

export { PredKeysSelect };
