import { ITextFieldProps, SystemIcon, TextField } from '@kadena/react-ui';

import useTranslation from 'next-translate/useTranslation';
import React, { type FC } from 'react';
import { FieldError } from 'react-hook-form';
import * as z from 'zod';

interface IAccountNameFieldProps
  extends Partial<Omit<ITextFieldProps, 'inputProps'>> {
  inputProps: Partial<ITextFieldProps['inputProps']>;
  error?: FieldError;
}

// @see; https://github.com/kadena-io/chainweb-node/blob/master/pact/coin-contract/v5/coin-v5.pact#L14
export const NAME_VALIDATION = z.string().min(3).max(256);

const AccountNameField: FC<IAccountNameFieldProps> = ({
  error,
  inputProps,
  status,
  helperText,
  ...rest
}) => {
  const { t } = useTranslation('common');

  return (
    <TextField
      label={t('Account')}
      status={error ? 'negative' : status}
      helperText={error?.message ?? helperText}
      {...rest}
      inputProps={{
        id: 'account-name-input',
        placeholder: t('Account'),
        leftIcon: SystemIcon.KIcon,
        ...inputProps,
      }}
    />
  );
};

export default AccountNameField;
