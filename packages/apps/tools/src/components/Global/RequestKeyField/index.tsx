import type { ITextFieldProps } from '@kadena/react-ui';
import { SystemIcon, TextField } from '@kadena/react-ui';
import useTranslation from 'next-translate/useTranslation';
import type { FC } from 'react';
import React, { forwardRef } from 'react';
import type { FieldError } from 'react-hook-form';
import * as z from 'zod';

export const RequestLength: { MIN: number; MAX: number } = { MIN: 43, MAX: 44 };

export const REQUEST_KEY_VALIDATION = z
  .string()
  .trim()
  .refine(
    (val) => {
      if (val.length === RequestLength.MAX) {
        return val[val.length - 1] === '=';
      }
      return val.length === RequestLength.MIN;
    },
    {
      message:
        'Your request key is invalid. Please provide a valid request key.',
    },
  );

interface IRequestKeyFieldProps extends Partial<ITextFieldProps> {
  error?: FieldError;
}

const RequestKeyField: FC<IRequestKeyFieldProps> = forwardRef<
  HTMLInputElement,
  IRequestKeyFieldProps
>(function RequestKeyField({ error, status, helperText, ...rest }, ref) {
  const { t } = useTranslation('common');

  const helper = helperText || error?.message;

  return (
    <TextField
      ref={ref}
      label={t('Request Key')}
      status={error ? 'negative' : status}
      helperText={helper}
      id="request-key-input"
      placeholder={t('Enter Request Key')}
      startIcon={<SystemIcon.KeyIconFilled />}
      {...rest}
    />
  );
});

export default RequestKeyField;
