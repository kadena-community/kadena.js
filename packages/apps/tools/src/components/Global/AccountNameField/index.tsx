import {
  IconButton,
  IInputProps,
  IInputWrapperProps,
  Input,
  InputWrapper,
  ISelectProps,
  Option,
  Select,
  SystemIcon,
} from '@kadena/react-ui';

import { accountInputWrapperStyle } from './styles.css';

import { useWalletConnectClient } from '@/context/connect-wallet-context';
import { useDidUpdateEffect } from '@/hooks';
import useTranslation from 'next-translate/useTranslation';
import React, { ChangeEvent, FC, useState } from 'react';
import { FieldError } from 'react-hook-form';
import * as z from 'zod';

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

  const getAccounts = (): string[] => {
    // eslint-disable-next-line @rushstack/security/no-unsafe-regexp
    const regex = new RegExp(`kadena\:${selectedNetwork}.*`);
    const result = new Set(
      accounts
        ?.filter((account) => {
          if (account.match(regex)) return account;
        })
        ?.map((account) => {
          const [, , accountName] = account.split(':');
          return accountName;
        }),
    );

    return Array.from(result) ?? [];
  };

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
        icon={SystemIcon.KIcon}
        id={elementId}
      >
        <Option value={''}>{t('Select Account')}</Option>
        {getAccounts().map((account) => (
          <Option key={account} value={account}>
            {account.slice(0, 4)}****{account.slice(-4)}
          </Option>
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
        leftIcon={SystemIcon.KIcon}
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
          icon={mode === 'input' ? SystemIcon.Close : SystemIcon.Edit}
          title={t('')}
          onClick={() => setMode(mode === 'input' ? 'select' : 'input')}
          type="button"
        />
      )}
    </div>
  );
};

export default AccountNameField;
