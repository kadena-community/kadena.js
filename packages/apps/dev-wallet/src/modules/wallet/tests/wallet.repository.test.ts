import { describe, expect, it } from 'vitest';
import { createWalletRepository } from '../wallet.repository';

describe('walletRepository', () => {
  it('should be defined', () => {
    expect(createWalletRepository).toBeDefined();
  });
});
