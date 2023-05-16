import { createGlobalTheme, createTheme } from '@vanilla-extract/css';

export const vars = createGlobalTheme(':root', {
  fonts: {
    main: "'Haas Grotesk Display', -apple-system, sans-serif",
    mono: "'Kadena Code', Menlo, monospace",
  },
  fontSizes: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    md: '1.123rem', // 18px
    lg: '1.25rem', // 20px
    xl: '1.5rem', // 24px
    '2xl': '1.75rem', // 28px
    '3xl': '2rem', // 32px
    '4xl': '2.25rem', // 36px
    '5xl': '2.5rem', // 40px
    '6xl': '2.75rem', // 44px
    '7xl': '3rem', // 48px
    '8xl': '3.25rem', // 52px
    '9xl': '3.75rem', // 60px
    '10xl': '4.5rem', // 72px
    '11xl': '5rem', // 80px
    '12xl': '5.25rem', // 84px
  },
  fontWeights: {
    light: '300',
    normal: '400',
    medium: '500',
    semiBold: '700',
    bold: '900',
  },
  radii: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    round: '999rem',
  },
  shadows: {
    // TODO: Update to match design system
    1: `0px 1px 2px 0 $colors$neutral3`,
  },
  sizes: {
    1: '0.25rem', // 4px
    2: '0.5rem', // 8px
    3: '0.75rem', // 12px
    4: '1rem', // 16px
    5: '1.25rem', // 20px
    6: '1.5rem', // 24px
    7: '1.75rem', // 28px
    8: '2rem', // 32px
    9: '2.25rem', // 36px
    10: '2.5rem', // 40px
    11: '2.75rem', // 44px
    12: '3rem', // 48px
    13: '3.25rem', // 52px
    14: '3.5rem', // 56px
    15: '3.75rem', // 60px
    16: '4rem', // 64px
    17: '4.25rem', // 68px
    18: '4.5rem', // 72px
    19: '4.75rem', // 76px
    20: '5rem', // 80px
    24: '6rem', // 96px
    25: '6.25rem', // 100px
    32: '8rem', // 128px
    40: '10rem', // 160px
    48: '12rem', // 192px
    56: '14rem', // 224px
    64: '16rem', // 256px

    '2xs': 'var(--spacing-2xs)',
    xs: 'var(--spacing-xs)',
    sm: 'var(--spacing-sm)',
    md: 'var(--spacing-md)',
    lg: 'var(--spacing-lg)',
    xl: 'var(--spacing-xl)',
    '2xl': 'var(--spacing-2xl)',
    '3xl': 'var(--spacing-3xl)',
  },
  colors: {
    neutral1: '#FAFAFA',
    neutral2: '#F0F0F0',
    neutral3: '#9EA1A6',
    neutral4: '#474F52',
    neutral5: '#1D1D1F',
    neutral6: '#050505',

    primaryAccent: '#2997FF',
    primarySurface: '#C2E1FF',
    primaryContrast: '#00498F',
    primaryHighContrast: '#002F5C',

    secondaryAccent: '#ED098F',
    secondarySurface: '#FDC4E5',
    secondaryContrast: '#710444',
    secondaryHighContrast: '#580335',

    positiveAccent: '#5EEA15',
    positiveSurface: '#E5FFD8',
    positiveContrast: '#194D00',
    positiveHighContrast: '#113300',

    warningAccent: '#FF9900',
    warningSurface: '#FFE7C2',
    warningContrast: '#704300',
    warningHighContrast: '#3D2500',

    negativeAccent: '#FF3338',
    negativeSurface: '#FFDAD8',
    negativeContrast: '#75000B',
    negativeHighContrast: '#410006',
  },
});

export const darkThemeClass = createTheme(vars.colors, {
  neutral1: '#050505',
  neutral2: '#1D1D1F',
  neutral3: '#474F52',
  neutral4: '#9EA1A6',
  neutral5: '#F0F0F0',
  neutral6: '#FAFAFA',

  primaryAccent: '#2997FF',
  primarySurface: '#00498F',
  primaryContrast: '#C2E1FF',
  primaryHighContrast: '#DBEDFF',

  secondaryAccent: '#ED098F',
  secondarySurface: '#580335',
  secondaryContrast: '#FB93D0',
  secondaryHighContrast: '#FDC4E5',

  positiveAccent: '#5EEA15',
  positiveSurface: '#113300',
  positiveContrast: '#CBFFB3',
  positiveHighContrast: '#E5FFD8',

  warningAccent: '#FF9900',
  warningSurface: '#3D2500',
  warningContrast: '#FFC670',
  warningHighContrast: '#FFE7C2',

  negativeAccent: '#FF3338',
  negativeSurface: '#410006',
  negativeContrast: '#FFA8B0',
  negativeHighContrast: '#FFDAD8',
});

export type ColorType =
  | 'primary'
  | 'secondary'
  | 'positive'
  | 'warning'
  | 'negative';
