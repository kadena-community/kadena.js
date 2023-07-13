import { FAILED, IParser, rule } from './rule';

export const fail: IParser<typeof FAILED> = rule(() => FAILED);
