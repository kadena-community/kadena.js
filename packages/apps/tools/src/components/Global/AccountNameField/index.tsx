import { ITextFieldProps, SystemIcon, TextField } from '@kadena/react-ui';

import useTranslation from 'next-translate/useTranslation';
import React, { type FC } from 'react';
import { FieldError } from 'react-hook-form';
import * as z from 'zod';

interface IAccountNameFieldProps {
  error?: FieldError;
  label?: ITextFieldProps['label'];
  inputProps: Omit<
    ITextFieldProps['inputProps'],
    'id' | 'placeholder' | 'leftIcon'
  >;
}

export const NAME_VALIDATION = z.string().min(3).max(256);

const AccountNameField: FC<IAccountNameFieldProps> = ({
  error,
  label,
  inputProps,
}) => {
  const { t } = useTranslation('common');

  return (
    <TextField
      label={label ?? t('Account')}
      inputProps={{
        ...inputProps,
        id: 'account-name-input',
        placeholder: t('Account'),
        leftIcon: SystemIcon.KIcon,
      }}
      status={error ? 'negative' : undefined}
      helperText={error?.message ?? ''}
    />
  );
};

export default AccountNameField;
