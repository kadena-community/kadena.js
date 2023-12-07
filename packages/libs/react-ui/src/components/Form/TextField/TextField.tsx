import type { IFormFieldWrapperProps, IInputProps } from '@components/Form';
import { FormFieldWrapper, Input } from '@components/Form';
import type { FC } from 'react';
import React, { useRef } from 'react';
import { useTextField } from 'react-aria';

export interface ITextFieldProps
  extends Omit<IFormFieldWrapperProps, 'children' | 'htmlFor'> {
  inputProps: Omit<IInputProps, 'disabled' | 'children' | 'leadingTextWidth'>;
}

export const TextField: FC<ITextFieldProps> = ({
  disabled = false,
  inputProps,
  status,
  ...props
}) => {
  const { id } = inputProps;
  const ref = useRef(null);
  const { labelProps, inputProps: ariaInputProps } = useTextField(props, ref);

  return (
    <FormFieldWrapper
      htmlFor={id}
      disabled={disabled}
      status={status}
      labelProps={labelProps}
      {...props}
    >
      <Input
        disabled={disabled}
        ref={ref}
        {...inputProps}
        {...ariaInputProps}
      />
    </FormFieldWrapper>
  );
};
