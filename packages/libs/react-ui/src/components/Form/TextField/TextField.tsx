import type { IFormFieldWrapperProps, IInputProps } from '@components/Form';
import { FormFieldWrapper, Input } from '@components/Form';
import type { FC } from 'react';
import React from 'react';

export interface ITextFieldProps
  extends Omit<IFormFieldWrapperProps, 'children' | 'htmlFor'> {
  inputProps: Omit<IInputProps, 'disabled' | 'children' | 'leadingTextWidth'>;
}

export const TextField: FC<ITextFieldProps> = ({
  disabled = false,
  inputProps,
  status,
  ...rest
}) => {
  const { id } = inputProps;

  return (
    <FormFieldWrapper
      htmlFor={id}
      disabled={disabled}
      status={status}
      {...rest}
    >
      <Input disabled={disabled} {...inputProps} />
    </FormFieldWrapper>
  );
};
