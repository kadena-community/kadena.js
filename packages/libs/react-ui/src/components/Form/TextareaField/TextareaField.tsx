import type { IInputWrapperProps, ITextareaProps } from '@components/Form';
import { InputWrapper, Textarea } from '@components/Form';
import type { FC } from 'react';
import React from 'react';

export interface ITextAreaFieldProps
  extends Omit<IInputWrapperProps, 'htmlFor' | 'children'> {
  textAreaProps: Omit<ITextareaProps, 'disabled'>;
}

export const TextAreaField: FC<ITextAreaFieldProps> = ({
  disabled = false,
  textAreaProps,
  ...rest
}) => {
  const { id } = textAreaProps;

  return (
    <InputWrapper htmlFor={id} disabled={disabled} {...rest}>
      <Textarea disabled={disabled} {...textAreaProps} />
    </InputWrapper>
  );
};
