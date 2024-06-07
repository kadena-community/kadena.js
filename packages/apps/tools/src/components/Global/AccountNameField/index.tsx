import type { ITextFieldProps } from '@kadena/react-ui';
import { TextField } from '@kadena/react-ui';
import useTranslation from 'next-translate/useTranslation';
import type { ForwardedRef } from 'react';
import React, { forwardRef } from 'react';
import { z } from 'zod';
import { accountInputWrapperStyle } from './styles.css';

export const NAME_VALIDATION = z.string().trim().min(3).max(256);

interface IAccountNameFieldProps extends Omit<ITextFieldProps, 'errorMessage'> {
  errorMessage?: string;
}
const BaseAccountNameField = (
  props: IAccountNameFieldProps,
  forwardedRef: ForwardedRef<HTMLInputElement>,
) => {
  const { t } = useTranslation('common');

  return (
    <div className={accountInputWrapperStyle}>
      <TextField
        {...props}
        label={props.label ?? t('Account Name')}
        fontType="code"
        placeholder={props.placeholder ?? t('Type Account Name')}
        id={props.id ?? 'kd-select-account-input'}
        isInvalid={!!props.errorMessage}
        errorMessage={props.errorMessage}
        ref={forwardedRef}
      />
    </div>
  );
};

export const AccountNameField = forwardRef(BaseAccountNameField);
