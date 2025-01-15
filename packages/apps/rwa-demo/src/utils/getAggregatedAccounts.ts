import type { ITransferToken } from '@/services/batchTransferTokens';

/**
 * for the TRANSFER capability:
 * make sure that every account is only in the array 1 time and the amount is aggregated for a single account
 */
export const getAggregatedAccounts = (data: ITransferToken[]) =>
  data.reduce((acc: ITransferToken[], val: ITransferToken) => {
    //check if account is already in the new array

    let isNew = true;
    const newAcc = acc.map((r) => {
      const newR = JSON.parse(JSON.stringify(r));
      if (newR.to === val.to) {
        newR.amount = `${parseFloat(newR.amount) + parseFloat(val.amount)}`;
        isNew = false;
      }

      return newR;
    });

    if (isNew) {
      newAcc.push(val);
    }
    return newAcc;
  }, []);
