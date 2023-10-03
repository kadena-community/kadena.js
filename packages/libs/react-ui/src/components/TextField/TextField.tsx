import type { IInputProps } from '@components/Input';
import { Input } from '@components/Input';
import type { IInputWrapperProps } from '@components/InputWrapper';
import { InputWrapper } from '@components/InputWrapper';
import type { FC } from 'react';
import React from 'react';

export interface ITextFieldProps
  extends Omit<IInputWrapperProps, 'children' | 'htmlFor'> {
  inputProps: Omit<IInputProps, 'disabled' | 'children' | 'leadingTextWidth'>;
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
