import type { ISelectProps } from '@components/Select';
import { Select } from '@components/Select';
import type { IInputWrapperProps } from '@components/InputWrapper';
import { InputWrapper } from '@components/InputWrapper';
import type { FC } from 'react';
import React from 'react';

export interface ISelectFieldProps extends Omit<IInputWrapperProps, 'htmlFor'> {
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
    <InputWrapper htmlFor={id} disabled={disabled} {...rest}>
      <Select disabled={disabled} {...selectProps}>
        {children}
      </Select>
    </InputWrapper>
  );
};
