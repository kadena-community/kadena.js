import { validateStructure } from '../validateStructure';

import { beforeEach, describe, expect, it } from 'vitest';
import { exampleExport as cwExport } from './exampleExport';

describe('convertFromChainweaver', () => {
  const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));
  let exampleExport: typeof cwExport;

  beforeEach(() => {
    // use deepClone to prevent modification by reference
    exampleExport = deepClone(cwExport);
  });

  it('validates correctly', () => {
    expect(() => {
      validateStructure(exampleExport);
    }).not.toThrow();
  });

  it('validates without _Tokens correctly', () => {
    const exampleExport2 = deepClone(cwExport);
    delete (exampleExport2.StoreFrontend_Data as any)[1];
    console.log(exampleExport2);

    expect(() => {
      validateStructure(exampleExport2);
    }).not.toThrow();
  });

  it('throws when BIPStorage_RootKey is not found', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { BIPStorage_Data, ...modifiedExport } = exampleExport;
    expect(() => {
      validateStructure(modifiedExport);
    }).toThrow();
  });

  it('throws when any of the StoreFrontend_Data tuples are missing', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (exampleExport.StoreFrontend_Data as any)[0][0];

    expect(() => {
      validateStructure(exampleExport);
    }).toThrow();
  });
});
