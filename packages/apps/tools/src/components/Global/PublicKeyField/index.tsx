import type { ITextFieldProps } from '@kadena/react-ui';
import { TextField } from '@kadena/react-ui';
import useTranslation from 'next-translate/useTranslation';
import type { FC } from 'react';
import React, { forwardRef } from 'react';
import type { FieldError } from 'react-hook-form';

interface IPublicKeyFieldProps extends Omit<ITextFieldProps, 'id'> {
  error?: FieldError;
}

export const PublicKeyField: FC<IPublicKeyFieldProps> = forwardRef<
  HTMLInputElement,
  IPublicKeyFieldProps
>(function PublicKeyField({ status, error, ...rest }, ref) {
  const { t } = useTranslation('common');

  return (
    <TextField
      ref={ref}
      label={t('Public Key')}
      status={error ? 'negative' : status}
      fontFamily="codeFont"
      id="public-key-input"
      placeholder={t('Enter Public Key')}
      {...rest}
    />
  );
});

export default PublicKeyField;
