import type { IAccountContext } from '@/components/AccountProvider/AccountProvider';
import { AccountContext } from '@/components/AccountProvider/AccountProvider';

import { useContext } from 'react';

export const useAccount = (): IAccountContext => useContext(AccountContext);
