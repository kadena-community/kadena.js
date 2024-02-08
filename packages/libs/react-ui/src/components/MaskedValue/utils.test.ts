import { describe, expect, it, vi } from 'vitest';
import { maskValue } from './utils';

describe('maskValue', () => {
  it('should mask value', () => {
    expect(maskValue('abcdefghijklmnopqrstuvwxyz')).toEqual('abcdef****wxyz');
    expect(
      maskValue(
        'k:4f0befc9ae690e3b2966d9e9a119269334e87892af2505ec4160016561bfbc18',
      ),
    ).toEqual('k:4f0b****bc18');

    // Edge cases
    expect(maskValue('K:003f****0769')).toEqual('K:003f****0769');
    expect(maskValue('K:8dea****bae6')).toEqual('K:8dea****bae6');
    expect(maskValue('K:f054****2f43')).toEqual('K:f054****2f43');

    expect(maskValue('a')).toEqual('a');
    expect(maskValue('123456')).toEqual('123456');
  });

  it('should mask value with custom options', () => {
    expect(maskValue('abcdefghijklmnopqrstuvwxyz', { maskLength: 2 })).toEqual(
      'abcdef**wxyz',
    );
    expect(maskValue('abcdefghijklmnopqrstuvwxyz', { character: '#' })).toEqual(
      'abcdef####wxyz',
    );
    expect(maskValue('abcdefghijklmnopqrstuvwxyz', { headLength: 3 })).toEqual(
      'abc****wxyz',
    );
    expect(maskValue('abcdefghijklmnopqrstuvwxyz', { tailLength: 3 })).toEqual(
      'abcdef****xyz',
    );
    expect(
      maskValue('abcdefghijklmnopqrstuvwxyz', {
        maskLength: 1,
        character: '2',
        headLength: 1,
        tailLength: 1,
      }),
    ).toEqual('a2z');

    // Edge cases
    expect(maskValue('abcdefghijklmnopqrstuvwxyz', { maskLength: 0 })).toEqual(
      'abcdefwxyz',
    );
    expect(
      maskValue('abcdefghijklmnopqrstuvwxyz', { maskLength: -10 }),
    ).toEqual('abcdefwxyz');
    expect(
      maskValue('abcdefghijklmnopqrstuvwxyz', {
        maskLength: 'abcdefghijklmnopqrstuvwxyz'.length,
      }),
    ).toEqual('**************************');
    expect(maskValue('abcdefghijklmnopqrstuvwxyz', { headLength: 0 })).toEqual(
      '****wxyz',
    );
    expect(maskValue('abcdefghijklmnopqrstuvwxyz', { tailLength: 0 })).toEqual(
      'abcdef****',
    );
    expect(maskValue('abcdefghijklmnopqrstuvwxyz', { headLength: -5 })).toEqual(
      '****wxyz',
    );
    expect(maskValue('abcdefghijklmnopqrstuvwxyz', { tailLength: -8 })).toEqual(
      'abcdef****',
    );
  });

  it('should a log if character is longer than 1', () => {
    const spy = vi.spyOn(console, 'warn');
    maskValue('1234567890', { character: 'toolong' });
    expect(spy).toHaveBeenCalledWith('Only one character is allowed');
  });
});
