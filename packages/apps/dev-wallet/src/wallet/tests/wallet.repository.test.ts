import { describe, expect, it } from 'vitest';
import { walletRepository } from '../wallet.repository';

describe('walletRepository', () => {
  it('should be defined', () => {
    expect(walletRepository).toBeDefined();
  });
});
