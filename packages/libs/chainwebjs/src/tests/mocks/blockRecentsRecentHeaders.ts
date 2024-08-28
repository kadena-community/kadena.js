// @ts-ignore
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @rushstack/typedef-var */

interface mockBlocks {
  [key: number]: {};
}
import type { IBlockHeader, IPagedResponse } from '../../types';
import { bigloadEnd } from './730-10';
import { bigloadMiddle } from './730-360-pageNext-inclusive-76kklGQO0cKSxtSSrhP_iD07J94VG3PHIxTDl7kQUhk';
import { bigloadStart } from './730-360-pageNext-inclusive-xz5JDTRLwqSC2T861tTGIovEcklBUbXxDw6VS7yYay4';

const getItemsFromArrByAmount = (
  obj: IPagedResponse<IBlockHeader>,
  amount: number,
  limit?: number | undefined,
) => ({
  limit: limit || obj.limit,
  items: limit
    ? obj.items.slice(Math.max(obj.items.length - limit, 0))
    : obj.items.slice(0, amount),
  next: obj.next,
});

const mocks = {
  0: { limit: 0, items: [], next: null },
  1: getItemsFromArrByAmount(bigloadStart, 1),
  9: getItemsFromArrByAmount(bigloadStart, 9),
  10: getItemsFromArrByAmount(bigloadStart, 10),
  100: getItemsFromArrByAmount(bigloadStart, 100),
  359: getItemsFromArrByAmount(bigloadStart, 359),
  360: getItemsFromArrByAmount(bigloadStart, 360),
  361: getItemsFromArrByAmount(bigloadMiddle, 1, 1),
  730360: bigloadStart,
  730720: bigloadMiddle,
  730730: bigloadEnd,
} as mockBlocks;

export const blockRecentsRecentHeadersMock = (n: number): mockBlocks =>
  mocks[n];
