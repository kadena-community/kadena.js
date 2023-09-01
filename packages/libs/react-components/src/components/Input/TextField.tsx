import { type IInputProps, Input } from './Input';
import { type IInputGroupProps, InputGroup } from './InputGroup';

import React, { type FC } from 'react';

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
