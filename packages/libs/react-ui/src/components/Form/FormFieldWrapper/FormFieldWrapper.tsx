import type {
  IInputProps,
  ISelectProps,
  ITextareaProps,
} from '@components/Form';
import type { FC, FunctionComponentElement } from 'react';
import React from 'react';
import type { vars } from 'src/styles';
import type { FormFieldStatus } from '../Form.css';

import { Stack } from '@components/Layout';
import type { IFormFieldHeaderProps } from './FormFieldHeader/FormFieldHeader';
import { FormFieldHeader } from './FormFieldHeader/FormFieldHeader';
import { FormFieldHelper } from './FormFieldHelper/FormFieldHelper';
import { FormFieldWrapperContext } from './FormFieldWrapper.context';
import { statusVariant } from './FormFieldWrapper.css';

export interface IFormFieldWrapperProps
  extends Omit<IFormFieldHeaderProps, 'label'> {
  children:
    | FunctionComponentElement<IInputProps | ISelectProps | ITextareaProps>
    | FunctionComponentElement<IInputProps | ISelectProps | ITextareaProps>[];
  status?: FormFieldStatus;
  disabled?: boolean;
  helperText?: string;
  label?: string;
  leadingTextWidth?: keyof typeof vars.sizes;
}

export const FormFieldWrapper: FC<IFormFieldWrapperProps> = ({
  status,
  disabled,
  children,
  label,
  leadingTextWidth = undefined,
  htmlFor,
  tag,
  info,
  helperText,
}) => {
  const statusVal = disabled === true ? 'disabled' : status;

  return (
    <FormFieldWrapperContext.Provider value={{ status, leadingTextWidth }}>
      <div className={statusVal ? statusVariant[statusVal] : undefined}>
        {label !== undefined && (
          <FormFieldHeader
            htmlFor={htmlFor}
            label={label}
            tag={tag}
            info={info}
          />
        )}
        <Stack gap="$2" direction="column">
          {children}
        </Stack>
        {Boolean(helperText) && <FormFieldHelper>{helperText}</FormFieldHelper>}
      </div>
    </FormFieldWrapperContext.Provider>
  );
};
