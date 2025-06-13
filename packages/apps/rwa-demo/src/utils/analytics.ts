import type { TXTYPES } from '@/contexts/TransactionsContext/TransactionsContext';
import * as Sentry from '@sentry/nextjs';

// eslint-disable-next-line @kadena-dev/typedef-var
export const EVENT_NAMES = {
  'error:submitChain': 'error:submitChain',
} as const;

const COOKIE_CONSENTNAME = 'cookie_consent';

type SentryData = {
  label: any;
  handled: boolean;
  type: any;
  data?: Record<string, any>;
  captureContext?: {
    level: 'error' | 'warning' | 'info' | 'fatal' | 'debug';
    extra?: Record<string, any>;
  };
};

// First define a base type for string-only keys excluding "sentryData"
type IOptionsType = {
  sentryData?: SentryData;
  [key: string]: string | undefined | SentryData;
};

interface IOptionsPageViewType {
  page_path?: string;
  send_to?: string;
}

export const analyticsEvent = (
  name:
    | keyof typeof EVENT_NAMES
    | keyof typeof TXTYPES
    | `error:${keyof typeof TXTYPES}`,
  options: IOptionsType = {},
): void => {
  if (options.sentryData) {
    Sentry.captureException(options.sentryData.label, {
      mechanism: {
        handled: options.sentryData.handled,
        type: options.sentryData.type,
        data: options.sentryData.data,
      },
      captureContext: options.sentryData.captureContext,
    });
  }

  if (process.env.NODE_ENV === 'development') {
    console.warn('GTAG EVENT', { name, options });
  }
  if (window.gtag === undefined) return;

  gtag('event', name, options);
};

export const analyticsPageView = (options: IOptionsPageViewType = {}): void => {
  if (process.env.NODE_ENV === 'development') {
    console.warn('GTAG EVENT', { options });
  }
  if (window.gtag === undefined) return;

  gtag('event', 'page_view', options);
};

export const updateConsent = (hasConsent: boolean): void => {
  const newValue = hasConsent ? 'granted' : 'denied';
  localStorage.setItem(COOKIE_CONSENTNAME, hasConsent.toString());

  if (process.env.NODE_ENV === 'development') {
    console.warn('SET CONSENT', { value: newValue });
  }

  if (window.gtag === undefined) return;

  gtag('consent', 'update', {
    ad_storage: 'denied',
    analytics_storage: newValue,
  });
};
