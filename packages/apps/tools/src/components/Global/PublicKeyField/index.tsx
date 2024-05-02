import type { ITextFieldProps } from '@kadena/react-ui';
import { TextField } from '@kadena/react-ui';
import useTranslation from 'next-translate/useTranslation';
import type { FC } from 'react';
import React, { forwardRef } from 'react';

export const PublicKeyField: FC<ITextFieldProps> = forwardRef<
  HTMLInputElement,
  ITextFieldProps
>(function PublicKeyField(props, ref) {
  const { t } = useTranslation('common');
  return (
    <TextField
      {...props}
      ref={ref}
      label={t('Public Key')}
      fontType="code"
      id="public-key-input"
      placeholder={t('Enter Public Key')}
    />
  );
});

export default PublicKeyField;
