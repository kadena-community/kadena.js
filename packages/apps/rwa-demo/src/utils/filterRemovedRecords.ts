export interface IRecord {
  isRemoved?: boolean;
  blockHeight?: number;
  chainId?: string;
  requestKey?: string;
  accountName: string;
  alias?: string;
  creationTime: number;
  result?: boolean;
}

export const filterRemovedRecords = (arr: IRecord[]): IRecord[] => {
  return arr
    .sort((a, b) => {
      if (a.creationTime < b.creationTime) return -1;
      return 1;
    })
    .reduce((acc: IRecord[], val: IRecord) => {
      if (val.isRemoved) {
        const newAcc = acc.filter((v) => v.accountName !== val.accountName);
        return newAcc;
      }
      acc.push(val);
      return acc;
    }, [])
    .filter((v, idx, self) => {
      return idx === self.findIndex((t) => t.accountName === v.accountName);
    });
};
