import type { IInputWrapperProps } from '@components/InputWrapper';
import { InputWrapper } from '@components/InputWrapper';
import type { ITextareaProps } from '@components/TextArea';
import { Textarea } from '@components/TextArea';
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
