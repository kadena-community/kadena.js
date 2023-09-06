import type { IInputProps } from './Input';
import { Input } from './Input';
import type { IInputGroupProps } from './InputGroup';
import { InputGroup } from './InputGroup';

import type { FC } from 'react';
import React from 'react';

export interface ITextFieldProps
  extends Omit<IInputGroupProps, 'as' | 'children' | 'className'> {
  inputProps: Omit<IInputProps, 'disabled' | 'status' | 'as' | 'children'>;
}

export const TextField: FC<ITextFieldProps> = ({
  status,
  disabled,
  inputProps,
  ...rest
}) => (
  <InputGroup {...rest} disabled={disabled} status={status}>
    <Input {...inputProps} disabled={disabled} status={status} />
  </InputGroup>
);
