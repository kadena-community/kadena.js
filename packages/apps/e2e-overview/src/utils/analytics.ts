import { COOKIE_CONSENTNAME } from '@/constants';
import * as Sentry from '@sentry/nextjs';

// eslint-disable-next-line @kadena-dev/typedef-var
export const EVENT_NAMES = {
  'error:update:app': 'error:update:app',
  'error:insert:app_test_version': 'error:insert:app_test_version',
  'error:update:app_test_version': 'error:update:app_test_version',
  'error:activate:app_test_version': 'error:activate:app_test_version',
  'error:insert:testrun': 'error:insert:testrun',
} as const;

interface CaptureContext {
  level?: 'error' | 'warning' | 'info' | 'fatal' | 'debug';
  extra?: Record<string, any>;
}
interface SentryData {
  label?: any;
  handled?: boolean;
  type: 'error' | 'db-error';
  data?: Record<string, any>;
  captureContext?: CaptureContext;
}

// First define a base type for string-only keys excluding "sentryData"
export interface IAnalyticsOptionsType {
  sentryData?: SentryData;
  [key: string]: string | undefined | SentryData;
}

interface IOptionsPageViewType {
  page_path?: string;
  send_to?: string;
}

export type IAnalyticsEventType = keyof typeof EVENT_NAMES;

export const analyticsEvent = (
  name: IAnalyticsEventType,
  options: IAnalyticsOptionsType = {},
): void => {
  if (options.sentryData) {
    const label =
      options.sentryData.label || new Error(`${options.name || name}`);
    const message = options.sentryData.data?.message || options.message;
    const captureContextLevel: CaptureContext['level'] =
      options.sentryData.captureContext?.level || 'error';
    const handled =
      options.sentryData.handled === undefined
        ? true
        : options.sentryData.handled;

    let explorerUrl = options.sentryData.data?.explorerUrl;
    if (
      !explorerUrl &&
      options.sentryData.captureContext?.extra?.res.requestKey
    ) {
      explorerUrl = `https://explorer.kadena.io/${options.networkId}/transaction/${options.sentryData.captureContext.extra.res.requestKey}`;
    }

    const sentryContent = {
      mechanism: {
        handled: handled,
        type: options.sentryData.type,
        data: { ...options.sentryData.data, message, explorerUrl },
      },
      captureContext: {
        ...options.sentryData.captureContext,
        level: captureContextLevel,
      },
    };

    Sentry.captureException(label, sentryContent);
  }

  if (process.env.NODE_ENV === 'development') {
    console.warn('GTAG EVENT', { name, options });
  }
  if (window.gtag === undefined) return;

  gtag('event', name, { ...options, name: options.name || name });
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
