import { describe, expect, it } from 'vitest';
import { kadenaGetPublic, kadenaMnemonicToSeed } from '..';

describe('kadenaGetPublic', async () => {
  it('should get the public key', async () => {
    const password = 'pass';
    const getPath = (index: number) => `m/44'/626'/${index}'/0'/0'`;
    const seed = await kadenaMnemonicToSeed(
      password,
      'coyote utility final warfare thumb symbol mule scale final nominee behave crumble',
    );
    console.log(seed);
    let publicKey = kadenaGetPublic(password, seed, 0);
    expect(publicKey).toBe(
      '43726c4a2e7b03fa5d23635307e5b130baf8b261e1081c099a2b43db1d4554cc',
    );
    publicKey = kadenaGetPublic(password, seed, 1);
    expect(publicKey).toBe(
      '3f53dfad097fdf8501c32b275e109980ed7121866a63ca34bb035c4a2e41a265',
    );
    publicKey = kadenaGetPublic(password, seed, 2);
    expect(publicKey).toBe(
      '3021bcfa703cc4fac007ab4c5050df5c0b8ca7d655ea80c84af9ea5e43ecf0ff',
    );
  });
});
