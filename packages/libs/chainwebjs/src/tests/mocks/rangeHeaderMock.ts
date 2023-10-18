/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @rushstack/typedef-var */
import { rangeheaderhash10 } from './range-header-10';

interface mockBlocks {
  [key: number]: [];
}

const mocks = {
  20010: rangeheaderhash10,
  2001010: rangeheaderhash10,
  30010: rangeheaderhash10,
  3001010: rangeheaderhash10,
  40010: rangeheaderhash10,
  4001010: rangeheaderhash10,
} as unknown as mockBlocks;

export const rangeHeadersMock = (n: number): mockBlocks => mocks[n];
