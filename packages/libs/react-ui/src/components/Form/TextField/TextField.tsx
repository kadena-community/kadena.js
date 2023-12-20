import type { IFormFieldWrapperProps, IInputProps } from '@components/Form';
import { Input } from '@components/Form';
import { Stack } from '@components/Layout';
import type { FC } from 'react';
import React from 'react';
import { FormFieldHeader, FormFieldHelper } from '../FormFieldWrapper';
import { statusVariant } from '../FormFieldWrapper/FormFieldWrapper.css';

export interface ITextFieldProps
  extends Omit<IFormFieldWrapperProps, 'children' | 'htmlFor'>,
    Omit<IInputProps, 'disabled' | 'children'> {}
export const TextField: FC<ITextFieldProps> = ({
  disabled = false,
  status,
  id,
  label,
  info,
  tag,
  helperText,
  ...inputProps
}) => {
  const statusVal = disabled === true ? 'disabled' : status;

  return (
    <div className={statusVal ? statusVariant[statusVal] : undefined}>
      {label !== undefined && (
        <FormFieldHeader htmlFor={id} label={label} tag={tag} info={info} />
      )}
      <Stack gap="$2" direction="column">
        <Input disabled={disabled} id={id} {...inputProps} />
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
