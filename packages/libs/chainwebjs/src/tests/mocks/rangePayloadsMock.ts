/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @rushstack/typedef-var */
import { rangepayload10 } from './range-payload-10';

interface mockBlocks {
  [key: number]: [];
}

const mocks = {
  20010: rangepayload10,
  30010: rangepayload10,
  40010: rangepayload10,
} as unknown as mockBlocks;

export const rangePayloadsMock = (n: number): mockBlocks => mocks[n];
