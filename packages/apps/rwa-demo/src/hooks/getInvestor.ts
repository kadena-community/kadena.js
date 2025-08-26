import type { IRecord } from '@/utils/filterRemovedRecords';

export const useGetInvestor = ({ account }: { account: string }) => {
  return { data: { accountName: account } as IRecord };
};
