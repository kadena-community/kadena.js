import { isOneOfLayoutType } from '..';

import * as Layouts from '@/components/Layout';

describe('utils isOneOfLayoutType', () => {
  it('return true when layout name is same as one of the following args', () => {
    expect(isOneOfLayoutType('full', 'code', 'full')).toEqual(true);

    expect(isOneOfLayoutType('full', 'full')).toEqual(true);
  });

  it('return true when layout displayName is same as one of the following args', () => {
    expect(isOneOfLayoutType(Layouts.Full, 'code', 'full')).toEqual(true);

    expect(isOneOfLayoutType(Layouts.Full, 'full')).toEqual(true);
  });

  it('return false when layout name is NOT same as one of the following args', () => {
    expect(isOneOfLayoutType('full', 'code', 'landing')).toEqual(false);
  });

  it('return true when layout displayName is same as one of the following args', () => {
    expect(isOneOfLayoutType(Layouts.CodeSide, 'codeer', 'full')).toEqual(
      false,
    );
  });
});
