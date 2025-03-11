import { MonoLoading } from '@kadena/kode-icons';
import React from 'react';
import { loaderClass } from './styles.css';

export const TransactionPendingIcon = () => {
  return <MonoLoading className={loaderClass} />;
};
