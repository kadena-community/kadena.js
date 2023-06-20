// eslint-disable-next-line @kadena-dev/typedef-var
export const EVENT_NAMES = {
  'click:asidemenu_deeplink': 'click:asidemenu_deeplink',
  'click:change_theme': 'click:change_theme',
  'click:open_searchmodal': 'click:open_searchmodal',
} as const;

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
  gtag('event', name, options);
};

export const analyticsPageView = (options: IOptionsPageViewType = {}): void => {
  if (process.env.NODE_ENV === 'development') {
    console.warn('GTAG EVENT', { options });
  }
  gtag('event', 'page_view', options);
};
