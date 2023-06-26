import { IInputProps, Input } from '../Input/Input';
import { IInputWrapperProps, InputWrapper } from '../InputWrapper/InputWrapper';

import React, { FC } from 'react';

export interface ITextFieldProps
  extends Omit<IInputWrapperProps, 'children' | 'htmlFor'> {
  inputProps: Omit<IInputProps, 'disabled' | 'children'>;
}

export const TextField: FC<ITextFieldProps> = ({
  disabled = false,
  inputProps,
  ...rest
}) => {
  const { id } = inputProps;

  return (
    <InputWrapper htmlFor={id} disabled={disabled} {...rest}>
      <Input disabled={disabled} {...inputProps} />
    </InputWrapper>
  );
};
