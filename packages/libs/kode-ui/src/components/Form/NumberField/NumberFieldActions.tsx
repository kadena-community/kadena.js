import { MonoAdd, MonoRemove } from '@kadena/react-icons/system';
import React from 'react';
import { Button } from '../../Button/Button';

import classNames from 'classnames';
import type { INumberFieldProps } from '.';
import { addOnIconSize, addOnStyleClass, iconSize } from './NumberField.css';

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
      className={classNames(iconSize[size], addOnStyleClass)}
      isDisabled={isDisabled || variant === 'readonly'}
      onPress={state.increment}
      variant="transparent"
    >
      <MonoAdd className={addOnIconSize[size]} />
    </Button>
    <Button
      className={classNames(iconSize[size], addOnStyleClass)}
      isDisabled={isDisabled || variant === 'readonly'}
      onPress={state.decrement}
      variant="transparent"
    >
      <MonoRemove className={addOnIconSize[size]} />
    </Button>
  </>
);
