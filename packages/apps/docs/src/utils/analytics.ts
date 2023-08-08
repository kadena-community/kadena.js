// eslint-disable-next-line @kadena-dev/typedef-var
export const EVENT_NAMES = {
  'click:asidemenu_deeplink': 'click:asidemenu_deeplink',
  'click:change_theme': 'click:change_theme',
  'click:open_searchmodal': 'click:open_searchmodal',
  'search:qa': 'search:qa',
  'search:docs': 'search:docs',
} as const;

export const COOKIE_CONSENTNAME = 'cookie_consent';

interface IOptionsType {
  label?: string;
  url?: string;
}
interface IOptionsPageViewType {
  page_path?: string;
  send_to?: string;
}

export const analyticsEvent = (
  name: keyof typeof EVENT_NAMES,
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
