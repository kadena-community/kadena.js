import { useWalletConnectClient } from '@/context/connect-wallet-context';
import type { ITextFieldProps } from '@kadena/react-ui';
import { TextField } from '@kadena/react-ui';
import useTranslation from 'next-translate/useTranslation';
import type { ForwardedRef } from 'react';
import React, { forwardRef } from 'react';
import * as z from 'zod';
import { accountInputWrapperStyle } from './styles.css';

export const NAME_VALIDATION = z.string().trim().min(3).max(256);

interface IAccountNameFieldProps
  extends Omit<
    ITextFieldProps,
    'errorMessage' | 'validationBehavior' | 'onValueChange'
  > {
  errorMessage?: string;
}
const BaseAccountNameField = (
  props: IAccountNameFieldProps,
  forwardedRef: ForwardedRef<HTMLInputElement>,
) => {
  const { t } = useTranslation('common');
  const { selectedAccount, setSelectedAccount } = useWalletConnectClient();

  return (
    <div className={accountInputWrapperStyle}>
      <TextField
        validationBehavior="aria"
        placeholder={t('Type Account Name')}
        id="kd-select-account-input"
        value={selectedAccount as string}
        onValueChange={setSelectedAccount}
        isInvalid={!!props.errorMessage}
        errorMessage={props.errorMessage}
        {...props}
        ref={forwardedRef}
      />
    </div>
  );
};

export const AccountNameField = forwardRef(BaseAccountNameField);
