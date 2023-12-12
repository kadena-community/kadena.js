import type { IFormFieldWrapperProps, ITextareaProps } from '@components/Form';
import { FormFieldWrapper, Textarea } from '@components/Form';
import type { FC } from 'react';
import React, { useRef } from 'react';
import { useTextField } from 'react-aria';

export interface ITextareaFieldProps
  extends Omit<IFormFieldWrapperProps, 'htmlFor' | 'children'> {
  textAreaProps: Omit<ITextareaProps, 'disabled'>;
}

export const TextareaField: FC<ITextareaFieldProps> = ({
  disabled = false,
  textAreaProps,
  status,
  ...rest
}) => {
  const { id } = textAreaProps;
  const ref = useRef(null);
  const { labelProps, inputProps, descriptionProps, errorMessageProps } =
    useTextField(
      {
        ...rest,
        inputElementType: 'textarea',
      },
      ref,
    );

  const computedDescriptionProps =
    status === 'negative' ? errorMessageProps : descriptionProps;

  return (
    <FormFieldWrapper
      htmlFor={id}
      disabled={disabled}
      labelProps={labelProps}
      helperTextProps={computedDescriptionProps}
      {...rest}
    >
      <Textarea
        disabled={disabled}
        ref={ref}
        {...textAreaProps}
        {...inputProps}
      />
    </FormFieldWrapper>
  );
};
