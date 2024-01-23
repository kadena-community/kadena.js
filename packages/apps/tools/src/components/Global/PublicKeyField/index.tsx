import type { ITextFieldProps } from '@kadena/react-ui';
import { TextField } from '@kadena/react-ui';
import { atoms } from '@kadena/react-ui/styles';
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
      ref={ref}
      label={t('Public Key')}
      className={atoms({
        fontFamily: 'codeFont',
      })}
      id="public-key-input"
      placeholder={t('Enter Public Key')}
      {...props}
    />
  );
});

export default PublicKeyField;
