import type { IFormFieldWrapperProps, IInputProps } from '@components/Form';
import { Input } from '@components/Form';
import { Stack } from '@components/Layout';
import type { FC } from 'react';
import React from 'react';
import { FormFieldHeader } from '../FormFieldWrapper/FormFieldHeader/FormFieldHeader';
import { FormFieldHelper } from '../FormFieldWrapper/FormFieldHelper/FormFieldHelper';
import { statusVariant } from '../FormFieldWrapper/FormFieldWrapper.css';

export interface ITextFieldProps
  extends Omit<IFormFieldWrapperProps, 'children' | 'htmlFor'>,
    Omit<IInputProps, 'disabled' | 'children'> {}
// remove exports for textArea, select and input
export const TextField: FC<ITextFieldProps> = ({
  disabled = false,
  status,
  leadingText,
  startIcon,
  leadingTextWidth,
  type,
  ref,
  id,
  outlined,
  label,
  info,
  tag,
  helperText,
  ...rest
}) => {
  const statusVal = disabled === true ? 'disabled' : status;

  return (
    <div className={statusVal ? statusVariant[statusVal] : undefined}>
      {label !== undefined && (
        <FormFieldHeader htmlFor={id} label={label} tag={tag} info={info} />
      )}
      <Stack gap="$2" direction="column">
        <Input
          disabled={disabled}
          leadingText={leadingText}
          leadingTextWidth={leadingTextWidth}
          startIcon={startIcon}
          type={type}
          ref={ref}
          id={id}
          outlined={outlined}
          {...rest}
        />
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
