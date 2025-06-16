const mocksHook = vi.hoisted(() => {
  return { addNotification: vi.fn() };
});

// Mocks must come before imports
vi.mock('@kadena/kode-ui/patterns', () => ({
  useNotifications: () => ({
    addNotification: mocksHook.addNotification,
  }),
}));

vi.mock('@/hooks/networks', () => ({
  useNetwork: () => ({
    activeNetwork: { networkId: 'testnet', chainId: '1' },
  }),
}));

vi.mock('@/utils/analytics', () => ({
  analyticsEvent: vi.fn(),
  EVENT_NAMES: { 'error:submit:addinvestor': 'error:submit:addinvestor' },
}));

import { analyticsEvent, EVENT_NAMES } from '@/utils/analytics';
import { useNotifications as useUINotifications } from '@kadena/kode-ui/patterns';
import { renderHook } from '@testing-library/react-hooks';
import { useNotifications } from '../notifications';

describe('useNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call addNotification from UI notifications', () => {
    const { result } = renderHook(() => useNotifications());
    const data = { intent: 'positive', message: 'Success!' };
    result.current.addNotification(data);

    expect(useUINotifications().addNotification).toHaveBeenCalledWith(data);
  });

  it('should call analyticsEvent when analytics and negative intent are provided', () => {
    const { result } = renderHook(() => useNotifications());
    const data = { intent: 'negative', message: 'Error!' };
    const analytics: any = {
      name: 'error:submit:addinvestor' as keyof typeof EVENT_NAMES, // valid event name
      options: {
        requestKey: 'abc123',
        sentryData: { type: 'submit_chain', data: {} },
      },
    };
    result.current.addNotification(data, analytics);
    expect(analyticsEvent).toHaveBeenCalledWith(
      'error:submit:addinvestor',
      expect.objectContaining({
        chainId: '1',
        networkId: 'testnet',
        sentryData: expect.objectContaining({
          data: expect.objectContaining({
            explorerUrl: expect.stringContaining('abc123'),
          }),
        }),
      }),
    );
  });

  it('should not call analyticsEvent if intent is not negative', () => {
    const { result } = renderHook(() => useNotifications());
    const data = { intent: 'positive', message: 'Success!' };
    const analytics: any = {
      name: 'error:submit:addinvestor' as keyof typeof EVENT_NAMES,
      options: {
        requestKey: 'abc123',
        sentryData: { type: 'submit_chain', data: {} },
      },
    };
    result.current.addNotification(data, analytics);
    expect(analyticsEvent).not.toHaveBeenCalled();
  });

  it('should include explorerUrl in sentryData when requestKey is provided', () => {
    const { result } = renderHook(() => useNotifications());
    const data = { intent: 'negative', message: 'Error!' };
    const analytics: any = {
      name: 'error:submit:addinvestor' as keyof typeof EVENT_NAMES,
      options: {
        requestKey: 'abc123',
        sentryData: { type: 'submit_chain', data: {} },
      },
    };
    result.current.addNotification(data, analytics);
    const sentryDataArg =
      vi.mocked(analyticsEvent).mock.calls[0][1]?.sentryData;
    expect(sentryDataArg?.data?.explorerUrl).toContain('abc123');
  });

  it('should not include explorerUrl in sentryData when requestKey is not provided', () => {
    const { result } = renderHook(() => useNotifications());
    const data = { intent: 'negative', message: 'Error!' };
    const analytics: any = {
      name: EVENT_NAMES['error:submit:addinvestor'],
      options: { sentryData: { data: {} } },
    };
    result.current.addNotification(data, analytics);
    const sentryDataArg =
      vi.mocked(analyticsEvent).mock?.calls[0][1]?.sentryData;
    expect(sentryDataArg?.data?.explorerUrl).toBeUndefined();
  });
});
