export const colorSchemes = ['light', 'dark'];
export const MEDIA = '(prefers-color-scheme: dark)';
const isServer = typeof window === 'undefined';

// Helpers
export const getTheme = (
  key: string,
  fallback?: string,
): string | undefined => {
  if (isServer) return undefined;
  let theme;
  try {
    theme = localStorage.getItem(key) ?? undefined;
  } catch (e) {
    // Unsupported
  }

  if (theme === undefined) return;

  return theme || fallback;
};

export const disableAnimation = (): (() => void) => {
  const css = document.createElement('style');
  css.appendChild(
    document.createTextNode(
      `*{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}`,
    ),
  );
  document.head.appendChild(css);

  return () => {
    // Force restyle
    (() => window.getComputedStyle(document.body))();

    // Wait for next tick before removing
    setTimeout(() => {
      document.head.removeChild(css);
    }, 1);
  };
};

export const getSystemTheme = (
  e?: MediaQueryList | MediaQueryListEvent,
): 'light' | 'dark' => {
  if (!e) e = window.matchMedia(MEDIA);
  const isDark = e.matches;
  const systemTheme = isDark ? 'dark' : 'light';
  return systemTheme;
};
