import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react-hooks';
import useWalletKit from '../hooks/useWalletKit';
import WalletKit from '@reown/walletkit';

vi.mock('@reown/walletkit', () => ({
  __esModule: true,
  default: {
    init: vi.fn().mockResolvedValue({
      on: vi.fn(),
    }),
  },
}));

vi.mock('@walletconnect/core', () => ({
  Core: vi.fn().mockImplementation(() => ({
  }))
}));

describe('useWalletKit', () => {
  it('initializes WalletKit and sets up event handlers', async () => {
    const mockSessionProposalHandler = vi.fn();
    const mockSessionRequestHandler = vi.fn();

    const { result, waitForNextUpdate } = renderHook(() =>
      useWalletKit(mockSessionProposalHandler, mockSessionRequestHandler)
    );

    await waitForNextUpdate();

    // Assertions to check if WalletKit was initialized and handlers set
    expect(WalletKit.init).toHaveBeenCalled();
    expect(result.current[0]).toBeTruthy();
    expect(result.current[1].current).toBeTruthy();
    expect(result.current[0]?.on).toHaveBeenCalledTimes(2);
  });
});
