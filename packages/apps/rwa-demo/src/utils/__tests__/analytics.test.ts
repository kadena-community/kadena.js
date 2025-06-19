import * as Sentry from '@sentry/nextjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  EVENT_NAMES,
  analyticsEvent,
  analyticsPageView,
  updateConsent,
} from '../analytics';

// Type definition is omitted to use the existing gtag definition

describe('analytics', () => {
  beforeEach(() => {
    // @ts-ignore - Ignore type issues with mocking gtag
    window.gtag = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('updateConsent', () => {
    it('should update the consent for gtag', () => {
      updateConsent(true);

      expect(window.gtag).toHaveBeenNthCalledWith(1, 'consent', 'update', {
        ad_storage: 'denied',
        analytics_storage: 'granted',
      });
    });

    it('should update the localstorage', () => {
      // Create a mock implementation for localStorage
      const localStorageMock = {
        getItem: vi.fn(),
        setItem: vi.fn(),
        clear: vi.fn(),
        removeItem: vi.fn(),
        length: 0,
        key: vi.fn(),
      };

      // Replace the global localStorage with our mock
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        writable: true,
      });

      updateConsent(false);

      expect(window.gtag).toHaveBeenNthCalledWith(1, 'consent', 'update', {
        ad_storage: 'denied',
        analytics_storage: 'denied',
      });

      expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'cookie_consent',
        'false',
      );
    });

    it('should also console.warn when the nodeenv is development', () => {
      const consoleMock = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);
      vi.stubEnv('NODE_ENV', 'development');

      updateConsent(true);

      expect(window.gtag).toHaveBeenNthCalledWith(1, 'consent', 'update', {
        ad_storage: 'denied',
        analytics_storage: 'granted',
      });

      expect(consoleMock).toBeCalledWith('SET CONSENT', {
        value: 'granted',
      });
    });
  });

  describe('analyticsPageView', () => {
    it('should call analyticsPageView with correct props', () => {
      analyticsPageView({
        page_path: '/skeletor',
        send_to: '12345',
      });

      expect(window.gtag).toHaveBeenNthCalledWith(1, 'event', 'page_view', {
        page_path: '/skeletor',
        send_to: '12345',
      });
    });

    it('should also console.warn when the nodeenv is development', () => {
      const consoleMock = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);

      vi.stubEnv('NODE_ENV', 'development');

      analyticsPageView({
        page_path: '/skeletor',
        send_to: '12345',
      });

      expect(window.gtag).toHaveBeenNthCalledWith(1, 'event', 'page_view', {
        page_path: '/skeletor',
        send_to: '12345',
      });

      expect(consoleMock).toBeCalledWith('GTAG EVENT', {
        options: { page_path: '/skeletor', send_to: '12345' },
      });
    });
  });

  describe('analyticsEvent', () => {
    it('should call analyticsEvent with correct props', () => {
      analyticsEvent(EVENT_NAMES['error:submitChain'], {
        label: 'Master of the universe',
        hash: '/he-man',
      });

      expect(window.gtag).toHaveBeenNthCalledWith(
        1,
        'event',
        'error:submitChain',
        {
          hash: '/he-man',
          label: 'Master of the universe',
          name: 'error:submitChain',
        },
      );
    });

    it('should also console.warn when the nodeenv is development', () => {
      const consoleMock = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);

      vi.stubEnv('NODE_ENV', 'development');
      analyticsEvent(EVENT_NAMES['error:submitChain'], {
        label: 'Master of the universe',
        hash: '/he-man',
      });

      expect(consoleMock).toBeCalledWith('GTAG EVENT', {
        name: 'error:submitChain',
        options: { hash: '/he-man', label: 'Master of the universe' },
      });
      expect(window.gtag).toHaveBeenNthCalledWith(
        1,
        'event',
        'error:submitChain',
        {
          hash: '/he-man',
          label: 'Master of the universe',
          name: 'error:submitChain',
        },
      );
    });
  });

  describe('analyticsEvent Sentry', () => {
    const OLD_ENV = process.env;
    let sentrySpy: ReturnType<typeof vi.spyOn>;
    beforeEach(() => {
      // @ts-ignore - The mock doesn't return the expected string value but that's ok for tests
      sentrySpy = vi
        .spyOn(Sentry, 'captureException')
        .mockImplementation(() => '');
      process.env = { ...OLD_ENV, NODE_ENV: 'production' };
    });
    afterAll(() => {
      process.env = OLD_ENV;
    });

    it('calls Sentry.captureException with correct label and sentryContent', () => {
      analyticsEvent(EVENT_NAMES['error:submitChain'], {
        sentryData: {
          type: 'submit_chain',
          label: 'Test Error',
          data: { message: 'fail', explorerUrl: 'url' },
          captureContext: { level: 'error', extra: { foo: 'bar' } },
        },
        message: 'fail',
        networkId: 'testnet',
      });
      expect(sentrySpy).toHaveBeenCalledWith(
        'Test Error',
        expect.objectContaining({
          mechanism: expect.objectContaining({
            handled: true,
            type: 'submit_chain',
            data: expect.objectContaining({
              message: 'fail',
              explorerUrl: 'url',
            }),
          }),
          captureContext: expect.objectContaining({
            level: 'error',
            extra: { foo: 'bar' },
          }),
        }),
      );
    });

    it('uses default label if none provided', () => {
      analyticsEvent(EVENT_NAMES['error:submitChain'], {
        sentryData: {
          type: 'submit_chain',
          data: { message: 'fail' },
        },
        message: 'fail',
        networkId: 'testnet',
      });
      expect(sentrySpy).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          mechanism: expect.objectContaining({
            type: 'submit_chain',
          }),
        }),
      );
    });

    it('sets handled to true by default', () => {
      analyticsEvent(EVENT_NAMES['error:submitChain'], {
        sentryData: {
          type: 'submit_chain',
          data: {},
        },
      });
      expect(sentrySpy).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          mechanism: expect.objectContaining({
            handled: true,
          }),
        }),
      );
    });

    it('sets handled to false if provided', () => {
      analyticsEvent(EVENT_NAMES['error:submitChain'], {
        sentryData: {
          type: 'submit_chain',
          handled: false,
          data: {},
        },
      });
      expect(sentrySpy).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          mechanism: expect.objectContaining({
            handled: false,
          }),
        }),
      );
    });

    it('adds explorerUrl from captureContext.extra.res.requestKey if not present', () => {
      analyticsEvent(EVENT_NAMES['error:submitChain'], {
        sentryData: {
          type: 'submit_chain',
          data: {},
          captureContext: { extra: { res: { requestKey: 'abc123' } } },
        },
        networkId: 'testnet',
      });
      expect(sentrySpy).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          mechanism: expect.objectContaining({
            data: expect.objectContaining({
              explorerUrl: expect.stringContaining('abc123'),
            }),
          }),
        }),
      );
    });
  });
});
