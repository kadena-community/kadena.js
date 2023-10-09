import type { ITextareaProps } from './TextArea';
import { Textarea } from './TextArea';

import type { IInputWrapperProps } from '@components/InputWrapper';
import { InputWrapper } from '@components/InputWrapper';
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
  return (
    <InputWrapper htmlFor={textAreaProps.id} disabled={disabled} {...rest}>
      <Textarea disabled={disabled} {...textAreaProps} />
    </InputWrapper>
  );
};
