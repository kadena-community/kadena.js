import type { TXTYPES } from '@/components/TransactionsProvider/TransactionsProvider';

// eslint-disable-next-line @kadena-dev/typedef-var
export const EVENT_NAMES = {
  'error:submitChain': 'error:submitChain',
} as const;

const COOKIE_CONSENTNAME = 'cookie_consent';

type IOptionsType = Record<string, string | undefined>;

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
