export interface IRecord {
  isRemoved?: boolean;
  blockHeight?: number;
  chainId: string;
  requestKey: string;
  accountName: string;
  creationTime: string;
  result: boolean;
}

export const filterRemovedRecords = (arr: IRecord[]): IRecord[] => {
  return arr
    .sort((a, b) => {
      if (
        new Date(a.creationTime).getTime() < new Date(b.creationTime).getTime()
      )
        return -1;
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
