import type { ITextFieldProps } from '@kadena/kode-ui';
import { Stack, TextField } from '@kadena/kode-ui';
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
    <Stack className={accountInputWrapperStyle} width="100%">
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
    </Stack>
  );
};

export const AccountNameField = forwardRef(BaseAccountNameField);
