import { useWalletConnectClient } from '@/context/connect-wallet-context';
import { useDidUpdateEffect } from '@/hooks';
import { getAccounts } from '@/utils/wallet';
import type {
  IInputProps,
  IInputWrapperProps,
  ISelectProps,
} from '@kadena/react-ui';
import { IconButton, Input, InputWrapper, Select } from '@kadena/react-ui';
import useTranslation from 'next-translate/useTranslation';
import type { ChangeEvent, FC } from 'react';
import React, { useState } from 'react';
import type { FieldError } from 'react-hook-form';
import * as z from 'zod';
import { accountInputWrapperStyle } from './styles.css';

interface IAccountNameFieldProps
  extends Partial<Omit<IInputWrapperProps, 'children'>> {
  inputProps: Partial<
    Pick<
      IInputProps,
      'id' | 'placeholder' | 'ref' | 'name' | 'onChange' | 'onBlur'
    >
  >;
  error?: FieldError;
}

export const NAME_VALIDATION = z.string().trim().min(3).max(256);

export const AccountNameField: FC<IAccountNameFieldProps> = ({
  inputProps,
  status,
  helperText,
  error,
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
        icon={'KIcon'}
        id={elementId}
      >
        <option value={''}>{t('Select Account')}</option>
        {getAccounts(accounts, selectedNetwork).map((account) => (
          <option key={account} value={account}>
            {account.slice(0, 4)}****{account.slice(-4)}
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
        icon={'KIcon'}
      />
    ),
  };

  return (
    <div className={accountInputWrapperStyle}>
      <InputWrapper
        label={t('Account')}
        htmlFor={elementId}
        status={error ? 'negative' : status}
        helperText={error?.message ?? helperText}
        {...rest}
      >
        {lookup[mode]}
      </InputWrapper>
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
