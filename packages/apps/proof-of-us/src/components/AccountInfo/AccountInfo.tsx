'use client';
import { useAccount } from '@/hooks/account';
import classnames from 'classnames';
import type { FC } from 'react';
import {
  avatarClass,
  avatarWrapperClass,
  dropdownClass,
  dropdownItemClass,
} from './style.css';

export const AccountInfo: FC = () => {
  const { account, logout, isMounted } = useAccount();

  const getInitial = (name: string) => {
    return name?.slice(0, 1);
  };

  if (!isMounted || !account) return null;
  return (
    <div className={avatarWrapperClass}>
      <button className={avatarClass}>{getInitial(account.alias)}</button>

      <ul className={classnames(dropdownClass)}>
        <li>
          <a
            className={dropdownItemClass}
            href={process.env.NEXT_PUBLIC_WALLET_URL}
          >
            wallet
          </a>
        </li>
        <li>
          <button className={dropdownItemClass} onClick={logout}>
            logout
          </button>
        </li>
      </ul>
    </div>
  );
};
