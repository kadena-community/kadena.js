import type { IFormFieldWrapperProps, ITextareaProps } from '@components/Form';
import { FormFieldWrapper, Textarea } from '@components/Form';
import type { FC } from 'react';
import React from 'react';

export interface ITextareaFieldProps
  extends Omit<IFormFieldWrapperProps, 'htmlFor' | 'children'>,
    Omit<ITextareaProps, 'disabled'> {}

export const TextareaField: FC<ITextareaFieldProps> = ({
  disabled = false,
  id,
  ...rest
}) => {
  return (
    <FormFieldWrapper htmlFor={id} disabled={disabled} {...rest}>
      <Textarea disabled={disabled} id={id} {...rest} />
    </FormFieldWrapper>
  );
};
