import { ITextFieldProps, SystemIcon, TextField } from '@kadena/react-ui';

import useTranslation from 'next-translate/useTranslation';
import React, { type FC } from 'react';
import { FieldError } from 'react-hook-form';
import * as z from 'zod';

export const RequestLength = { MIN: 43, MAX: 44 };

export const REQUEST_KEY_VALIDATION = z.string().refine(
  (val) => {
    if (val.length === RequestLength.MAX) {
      return val[val.length - 1] === '=';
    }
    return val.length === RequestLength.MIN;
  },
  {
    message: 'Your request key is invalid. Please provide a valid request key.',
  },
);

interface IRequestKeyFieldProps
  extends Partial<Omit<ITextFieldProps, 'inputProps'>> {
  inputProps: Partial<ITextFieldProps['inputProps']>;
  error?: FieldError;
}

const RequestKeyField: FC<IRequestKeyFieldProps> = ({
  error,
  inputProps,
  status,
  helperText,
  ...rest
}) => {
  const { t } = useTranslation('common');

  return (
    <TextField
      label={t('Request Key')}
      status={error ? 'negative' : status}
      helperText={error?.message ?? helperText}
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
