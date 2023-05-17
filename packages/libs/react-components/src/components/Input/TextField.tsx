import { IInputProps, Input } from './Input';
import { IInputGroupProps, InputGroup } from './InputGroup';

import React, { FC } from 'react';

export interface ITextFieldProps
  extends Omit<IInputGroupProps, 'as' | 'children'> {
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
