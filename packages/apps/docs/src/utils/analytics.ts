// eslint-disable-next-line @kadena-dev/typedef-var
export const EVENT_NAMES = {
  'click:asidemenu_deeplink': 'click:asidemenu_deeplink',
  'click:change_theme': 'click:change_theme',
  'click:open_searchmodal': 'click:open_searchmodal',
  'click:mobile_search': 'click:mobile_search',
  'click:home_search': 'click:home_search',
  'click:mobile_menu_open': 'click:mobile_menu_open',
  'click:edit_page': 'click:edit_page',
  'click:previous_page': 'click:previous_page',
  'click:next_page': 'click:next_page',
  'click:newsletter': 'click:newsletter',
  'click:search': 'click:search',
  'click:subscribe': 'click:subscribe',
  'click:page_helpful': 'click:page_helpful',
} as const;

const COOKIE_CONSENTNAME = 'cookie_consent';

type IOptionsType = Record<string, string | undefined>;

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
