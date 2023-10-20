import type { IInputProps, IInputWrapperProps } from '@kadena/react-ui';
import { TextField } from '@kadena/react-ui';

import useTranslation from 'next-translate/useTranslation';
import type { FC } from 'react';
import React from 'react';
import type { FieldError } from 'react-hook-form';

interface IPublicKeyFieldProps
  extends Partial<Omit<IInputWrapperProps, 'children'>> {
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
  );
};

export default PublicKeyField;
