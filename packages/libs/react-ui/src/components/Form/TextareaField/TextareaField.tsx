import type { IFormFieldWrapperProps, ITextareaProps } from '@components/Form';
import { Textarea } from '@components/Form';
import { Stack } from '@components/Layout';
import type { FC } from 'react';
import React from 'react';
import { FormFieldHeader, FormFieldHelper } from '../FormFieldWrapper';
import { statusVariant } from '../FormFieldWrapper/FormFieldWrapper.css';

export interface ITextareaFieldProps
  extends Omit<IFormFieldWrapperProps, 'htmlFor' | 'children'>,
    Omit<ITextareaProps, 'disabled'> {}

export const TextareaField: FC<ITextareaFieldProps> = ({
  disabled = false,
  id,
  status,
  tag,
  info,
  helperText,
  label,
  ...rest
}) => {
  const statusVal = disabled === true ? 'disabled' : status;

  return (
    <div className={statusVal ? statusVariant[statusVal] : undefined}>
      {label !== undefined && (
        <FormFieldHeader htmlFor={id} label={label} tag={tag} info={info} />
      )}
      <Stack gap="$2" direction="column">
        <Textarea disabled={disabled} id={id} {...rest} />
      </Stack>
      {Boolean(helperText) && status !== 'negative' && (
        <FormFieldHelper>{helperText}</FormFieldHelper>
      )}
      {Boolean(helperText) && status === 'negative' && (
        <FormFieldHelper>{helperText}</FormFieldHelper>
      )}
    </div>
  );
};
