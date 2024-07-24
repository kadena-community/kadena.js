// eslint-disable-next-line @kadena-dev/typedef-var
export const EVENT_NAMES = {
  'click:search': 'click:search',
  'click:validate_network': 'click:validate_network',
  'click:add_network': 'click:add_network',
  'click:remove_network': 'click:remove_network',
  'click:change_network': 'click:change_network',
  'click:switch_theme': 'click:switch_theme',
  'click:open_graphDialog': 'click:open_graphDialog',
  'click:open_configDialog': 'click:open_configDialog',
  'click:nav_sociallink': 'click:nav_sociallink',
  'click:nav_footerlink': 'click:nav_footerlink',
  'click:open_blockheightpopup': 'click:open_blockheightpopup',
  'event:stopserver': 'event:stopserver',
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
