import { MonoAdd, MonoRemove } from '@kadena/react-icons/system';
import React from 'react';
import { Button } from '../../Button/Button';

import type { INumberFieldProps } from '../NumberField';
import { iconSize } from '../NumberField/NumberField.css';

interface INumberFieldActionsProps {
  isDisabled?: boolean;
  variant: string;
  state: any;
  size?: INumberFieldProps['size'];
}

export const NumberFieldActions = ({
  isDisabled = false,
  variant,
  state,
  size = 'md',
}: INumberFieldActionsProps) => (
  <>
    <Button
      className={iconSize[size]}
      isDisabled={isDisabled || variant === 'readonly'}
      onPress={state.increment}
      variant="transparent"
    >
      <MonoAdd />
    </Button>
    <Button
      className={iconSize[size]}
      isDisabled={isDisabled || variant === 'readonly'}
      onPress={state.decrement}
      variant="transparent"
    >
      <MonoRemove />
    </Button>
  </>
);
