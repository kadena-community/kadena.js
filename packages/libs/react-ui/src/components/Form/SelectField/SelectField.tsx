import type { IFormFieldWrapperProps, ISelectProps } from '@components/Form';
import { FormFieldWrapper, Select } from '@components/Form';
import type { FC } from 'react';
import React from 'react';

export interface ISelectFieldProps
  extends Omit<IFormFieldWrapperProps, 'htmlFor'> {
  selectProps: Omit<ISelectProps, 'disabled' | 'children' | 'leadingTextWidth'>;
}

export const SelectField: FC<ISelectFieldProps> = ({
  disabled = false,
  selectProps,
  children,
  ...rest
}) => {
  const { id } = selectProps;

  return (
    <FormFieldWrapper htmlFor={id} disabled={disabled} {...rest}>
      <Select disabled={disabled} {...selectProps}>
        {children}
      </Select>
    </FormFieldWrapper>
  );
};
