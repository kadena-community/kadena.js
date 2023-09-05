import type { IParser } from './rule';
import { FAILED, rule } from './rule';

export const fail: IParser<typeof FAILED> = rule(() => FAILED);
