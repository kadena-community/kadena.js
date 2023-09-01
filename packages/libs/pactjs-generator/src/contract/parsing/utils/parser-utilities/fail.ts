import { type IParser, FAILED, rule } from './rule';

export const fail: IParser<typeof FAILED> = rule(() => FAILED);
