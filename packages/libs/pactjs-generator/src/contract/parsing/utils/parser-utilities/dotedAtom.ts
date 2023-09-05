import { asString } from './asString';
import { atom } from './atom';
import { id } from './id';
import { repeat } from './repeat';
import type { IParser } from './rule';
import { seq } from './seq';

/**
 * @example namespace.module.function
 */
export const dotedAtom: IParser<string> = asString(
  seq(seq(atom, id('.')), repeat(seq(atom, id('.'))), atom),
);
