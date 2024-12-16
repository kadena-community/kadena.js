import { IGuard } from '@/modules/account/account.repository';
import { ChainId } from '@kadena/client';

export interface IRetrievedAccount {
  alias?: string;
  address: string;
  chains: Array<{ chainId: ChainId; balance: string }>;
  overallBalance: string;
  guard: IGuard;
  keysToSignWith?: string[];
}
