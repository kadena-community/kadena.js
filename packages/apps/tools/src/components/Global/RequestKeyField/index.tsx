import { ITextFieldProps, SystemIcon, TextField } from '@kadena/react-ui';

import useTranslation from 'next-translate/useTranslation';
import React, { type FC } from 'react';
import { FieldError } from 'react-hook-form';
import * as z from 'zod';

const RequestLength = { MIN: 43, MAX: 44 };

export const REQUEST_KEY_VALIDATION = z
  .string()
  .min(RequestLength.MIN)
  .max(RequestLength.MAX);

interface IRequestKeyFieldProps
  extends Partial<Omit<ITextFieldProps, 'inputProps'>> {
  inputProps: Partial<ITextFieldProps['inputProps']>;
  error?: FieldError;
}

const RequestKeyField: FC<IRequestKeyFieldProps> = ({
  error,
  inputProps,
  ...rest
}) => {
  const { t } = useTranslation('common');

  return (
    <TextField
      label={t('Request Key')}
      status={error ? 'negative' : undefined}
      helperText={error?.message ?? ''}
      {...rest}
      inputProps={{
        id: 'request-key-input',
        placeholder: t('Enter Request Key'),
        leftIcon: SystemIcon.KeyIconFilled,
        ...inputProps,
      }}
    />
  );
};

export default RequestKeyField;
