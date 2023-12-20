import type { ITextFieldProps } from '@kadena/react-ui';
import { TextField } from '@kadena/react-ui';
import useTranslation from 'next-translate/useTranslation';
import type { FC } from 'react';
import React from 'react';
import type { FieldError } from 'react-hook-form';
import { publicKeyFieldStyles } from './styles.css';

interface IPublicKeyFieldProps extends Omit<ITextFieldProps, 'id'> {
  error?: FieldError;
}

export const PublicKeyField: FC<IPublicKeyFieldProps> = ({
  status,
  error,
  ...rest
}) => {
  const { t } = useTranslation('common');

  return (
    <span className={publicKeyFieldStyles}>
      <TextField
        label={t('Public Key')}
        status={error ? 'negative' : status}
        id="public-key-input"
        placeholder={t('Enter Public Key')}
        {...rest}
      />
    </span>
  );
};

export default PublicKeyField;
