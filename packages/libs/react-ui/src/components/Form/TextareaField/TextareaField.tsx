import type { IFormFieldWrapperProps, ITextareaProps } from '@components/Form';
import { FormFieldWrapper, Textarea } from '@components/Form';
import type { FC } from 'react';
import React from 'react';

export interface ITextareaFieldProps
  extends Omit<IFormFieldWrapperProps, 'htmlFor' | 'children'> {
  textAreaProps: Omit<ITextareaProps, 'disabled'>;
}

export const TextareaField: FC<ITextareaFieldProps> = ({
  disabled = false,
  textAreaProps,
  ...rest
}) => {
  const { id } = textAreaProps;

  return (
    <FormFieldWrapper htmlFor={id} disabled={disabled} {...rest}>
      <Textarea disabled={disabled} {...textAreaProps} />
    </FormFieldWrapper>
  );
};
