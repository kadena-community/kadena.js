import type { IFormFieldWrapperProps, IInputProps } from '@kadena/react-ui';
import { TextField } from '@kadena/react-ui';

import useTranslation from 'next-translate/useTranslation';
import type { FC } from 'react';
import React from 'react';
import type { FieldError } from 'react-hook-form';
import { publicKeyFieldStyles } from './styles.css';

interface IPublicKeyFieldProps
  extends Partial<Omit<IFormFieldWrapperProps, 'children'>> {
  inputProps: Partial<
    Pick<
      IInputProps,
      'id' | 'placeholder' | 'ref' | 'name' | 'onChange' | 'onBlur'
    >
  >;
  error?: FieldError;
}

export const PublicKeyField: FC<IPublicKeyFieldProps> = ({
  inputProps,
  status,
  helperText,
  error,
  ...rest
}) => {
  const { t } = useTranslation('common');

  return (
    <span className={publicKeyFieldStyles}>
      <TextField
        label={t('Public Key')}
        status={error ? 'negative' : status}
        helperText={helperText}
        {...rest}
        inputProps={{
          id: 'public-key-input',
          placeholder: t('Enter Public Key'),
          ...inputProps,
        }}
      />
    </span>
  );
};

export default PublicKeyField;
