import { useWalletConnectClient } from '@/context/connect-wallet-context';
import { useDidUpdateEffect } from '@/hooks';
import { getAccounts } from '@/utils/wallet';
import type {
  IFormFieldWrapperProps,
  IInputProps,
  ISelectProps,
} from '@kadena/react-ui';
import {
  FormFieldWrapper,
  IconButton,
  Input,
  Select,
  maskValue,
} from '@kadena/react-ui';
import useTranslation from 'next-translate/useTranslation';
import type { ChangeEvent, FC } from 'react';
import React, { useState } from 'react';
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
  const [mode, setMode] = useState<'input' | 'select'>('input');
  const { t } = useTranslation('common');
  const { onChange, ...restInputProps } = inputProps;

  const {
    accounts,
    selectedAccount,
    selectedNetwork,
    setSelectedAccount,
    session,
  } = useWalletConnectClient();

  useDidUpdateEffect(() => {
    if (session && accounts?.length) setMode('select');
    else setMode('input');
  }, [session, accounts]);

  const lookup = {
    select: (
      <Select
        {...(restInputProps as ISelectProps)}
        ariaLabel={t('Select Account')}
        value={selectedAccount as unknown as string}
        onChange={(e) => {
          setSelectedAccount(e.target.value);
          onChange?.(e as unknown as ChangeEvent<HTMLInputElement>);
        }}
        icon={noIcon ? 'KIcon' : undefined}
        id={elementId}
      >
        <option value={''}>{t('Select Account')}</option>
        {getAccounts(accounts, selectedNetwork).map((account) => (
          <option key={account} value={account}>
            {maskValue(account)}
          </option>
        ))}
      </Select>
    ),
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
      {accounts?.length && (
        <IconButton
          icon={mode === 'input' ? 'Close' : 'Edit'}
          title={t('')}
          onClick={() => setMode(mode === 'input' ? 'select' : 'input')}
          type="button"
        />
      )}
    </div>
  );
};

export default AccountNameField;
