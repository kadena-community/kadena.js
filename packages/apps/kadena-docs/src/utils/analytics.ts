export const EVENT_NAMES = {
  'click:asidemenu_deeplink': 'click:asidemenu_deeplink',
  'click:change_theme': 'click:change_theme',
  'click:open_searchmodal': 'click:open_searchmodal',
} as const;

interface OptionsType {
  label?: string;
  href?: string;
}

export const analyticsEvent = (
  name: keyof typeof EVENT_NAMES,
  options: OptionsType = {},
): void => {
  gtag('event', name, options);
};
