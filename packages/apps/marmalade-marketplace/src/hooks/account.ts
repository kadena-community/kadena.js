import type { IAccountContext } from '@/providers/AccountProvider/AccountProvider';
import { AccountContext } from '@/providers/AccountProvider/AccountProvider';

import { useContext } from 'react';

export const useAccount = (): IAccountContext => useContext(AccountContext);
