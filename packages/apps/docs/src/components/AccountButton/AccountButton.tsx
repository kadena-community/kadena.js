import { useAccount } from '@/hooks/useAccount';
import { IconButton, SystemIcon } from '@kadena/react-ui';
import classNames from 'classnames';
import type { FC } from 'react';
import React from 'react';
import {
  headerButtonClass,
  iconButtonClass,
} from '../Layout/components/Header/styles.css';

export const AccountButton: FC = () => {
  const { login, logout, account } = useAccount();

  if (account) {
    return (
      <button
        onClick={logout}
        className={classNames(headerButtonClass, iconButtonClass)}
      >
        <SystemIcon.KIcon />
      </button>
    );
  }

  return (
    <button
      onClick={login}
      className={classNames(headerButtonClass, iconButtonClass)}
    >
      <SystemIcon.Account />
    </button>
  );
};
