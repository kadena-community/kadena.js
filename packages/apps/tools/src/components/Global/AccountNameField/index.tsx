import { useWalletConnectClient } from '@/context/connect-wallet-context';
import type { IFormFieldWrapperProps, IInputProps } from '@kadena/react-ui';
import { FormFieldWrapper, Input } from '@kadena/react-ui';
import useTranslation from 'next-translate/useTranslation';
import type { FC } from 'react';
import React from 'react';
import type { FieldError } from 'react-hook-form';
import * as z from 'zod';
import { accountInputWrapperStyle } from './styles.css';

interface IAccountNameFieldProps
  extends Partial<Omit<IFormFieldWrapperProps, 'children'>> {
  inputProps: Partial<
    Pick<
      IInputProps,
      'id' | 'placeholder' | 'ref' | 'name' | 'onChange' | 'onBlur'
    >
  >;
  error?: FieldError;
  noIcon?: boolean;
}

export const NAME_VALIDATION = z.string().trim().min(3).max(256);

export const AccountNameField: FC<IAccountNameFieldProps> = ({
  inputProps,
  status,
  helperText,
  error,
  noIcon = false,
  ...rest
}) => {
  const elementId = 'kd-select-account-input';
  const mode = 'input';
  const { t } = useTranslation('common');
  const { onChange, ...restInputProps } = inputProps;

  const { selectedAccount, setSelectedAccount } = useWalletConnectClient();

  const lookup = {
    input: (
      <Input
        {...restInputProps}
        placeholder={t('Type Account Name')}
        id={'kd-select-account-input'}
        value={selectedAccount as string}
        onChange={(e) => {
          setSelectedAccount(e.target.value);
          onChange?.(e);
        }}
        icon={noIcon ? undefined : 'KIcon'}
      />
    ),
  };

  return (
    <div className={accountInputWrapperStyle}>
      <FormFieldWrapper
        label={t('Account')}
        htmlFor={elementId}
        status={error ? 'negative' : status}
        helperText={error?.message ?? helperText}
        {...rest}
      >
        {lookup[mode]}
      </FormFieldWrapper>
    </div>
  );
};

export default AccountNameField;
