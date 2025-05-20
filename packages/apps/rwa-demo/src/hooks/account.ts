import type { IAccountContext } from '@/contexts/AccountContext/AccountContext';
import { AccountContext } from '@/contexts/AccountContext/AccountContext';
import { useContext } from 'react';

export const useAccount = (): IAccountContext => useContext(AccountContext);
