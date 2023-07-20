import { createGlobalTheme, createTheme } from '@vanilla-extract/css';

export const vars = createGlobalTheme(':root', {
  fonts: {
    $main: "'Haas Grotesk Display', -apple-system, sans-serif",
    $mono: "'Kode Mono', Menlo, monospace",
  },
  fontSizes: {
    $xs: '0.75rem', // 12px
    $sm: '0.875rem', // 14px
    $base: '1rem', // 16px
    $md: '1.123rem', // 18px
    $lg: '1.25rem', // 20px
    $xl: '1.5rem', // 24px
    $2xl: '1.75rem', // 28px
    $3xl: '2rem', // 32px
    $4xl: '2.25rem', // 36px
    $5xl: '2.5rem', // 40px
    $6xl: '2.75rem', // 44px
    $7xl: '3rem', // 48px
    $8xl: '3.25rem', // 52px
    $9xl: '3.75rem', // 60px
    $10xl: '4.5rem', // 72px
    $11xl: '5rem', // 80px
    $12xl: '5.25rem', // 84px
  },
  lineHeights: {
    $base: '1.4',
    $lg: '1.9',
  },
  fontWeights: {
    $light: '300',
    $normal: '400',
    $medium: '500',
    $semiBold: '700',
    $bold: '700',
  },
  radii: {
    $sm: '4px',
    $md: '6px',
    $lg: '8px',
    $round: '999rem',
  },
  borderWidths: {
    $md: '2px',
  },
  shadows: {
    // TODO: Update to match design system
    $1: `0px 1px 2px 0 $colors$neutral3`,
  },
  sizes: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    0: '0',
    $1: '0.25rem', // 4px
    $2: '0.5rem', // 8px
    $3: '0.75rem', // 12px
    $4: '1rem', // 16px
    $5: '1.25rem', // 20px
    $6: '1.5rem', // 24px
    $7: '1.75rem', // 28px
    $8: '2rem', // 32px
    $9: '2.25rem', // 36px
    $10: '2.5rem', // 40px
    $11: '2.75rem', // 44px
    $12: '3rem', // 48px
    $13: '3.25rem', // 52px
    $14: '3.5rem', // 56px
    $15: '3.75rem', // 60px
    $16: '4rem', // 64px
    $17: '4.25rem', // 68px
    $18: '4.5rem', // 72px
    $19: '4.75rem', // 76px
    $20: '5rem', // 80px
    $24: '6rem', // 96px
    $25: '6.25rem', // 100px
    $32: '8rem', // 128px
    $35: '8.75rem', // 140px
    $40: '10rem', // 160px
    $48: '12rem', // 192px
    $56: '14rem', // 224px
    $64: '16rem', // 256px

    $2xs: 'var(--spacing-2xs)',
    $xs: 'var(--spacing-xs)',
    $sm: 'var(--spacing-sm)',
    $md: 'var(--spacing-md)',
    $lg: 'var(--spacing-lg)',
    $xl: 'var(--spacing-xl)',
    $2xl: 'var(--spacing-2xl)',
    $3xl: 'var(--spacing-3xl)',
  },
  colors: {
    $foreground: '#050505',
    $background: '#FAFAFA',

    $neutral1: '#FAFAFA',
    $neutral2: '#F0F0F0',
    $neutral3: '#9EA1A6',
    $neutral4: '#474F52',
    $neutral5: '#1D1D1F',
    $neutral6: '#050505',

    $primaryAccent: '#2997FF',
    $primarySurface: '#C2E1FF',
    $primaryContrast: '#00498F',
    $primaryHighContrast: '#002F5C',

    $secondaryAccent: '#ED098F',
    $secondarySurface: '#FB93D0',
    $secondaryContrast: '#A30662',
    $secondaryHighContrast: '#580335',

    $tertiaryAccent: '#9D00FF',
    $tertiarySurface: '#C870FF',
    $tertiaryContrast: '#6400A3',
    $tertiaryHighContrast: '#320052',

    $borderDefault: '#E4E6E7',
    $borderSubtle: '#D8D9DB',
    $borderContrast: '#9EA1A6',

    $layoutSurfaceDefault: '#FAFAFA',
    $layoutSurfaceSubtle: '#F0F0F0',
    $layoutSurfaceContrast: '#FFFFFF',
    $layoutSurfaceOverlay: '#757575',

    $infoAccent: '#2997FF',
    $infoSurface: '#DBEDFF',
    $infoContrast: '#00498F',
    $infoHighContrast: '#002F5C',

    $positiveAccent: '#5EEA15',
    $positiveSurface: '#E5FFD8',
    $positiveContrast: '#1F6100',
    $positiveHighContrast: '#113300',

    $warningAccent: '#FF9900',
    $warningSurface: '#FFE7C2',
    $warningContrast: '#704300',
    $warningHighContrast: '#3D2500',

    $negativeAccent: '#FF3338',
    $negativeSurface: '#FFE7E5',
    $negativeContrast: '#75000B',
    $negativeHighContrast: '#410006',

    $disabledContrast: '#C5C7CA',
  },
});

export const darkThemeClass = createTheme(vars.colors, {
  $foreground: '#FAFAFA',
  $background: '#050505',

  $neutral1: '#050505',
  $neutral2: '#1D1D1F',
  $neutral3: '#474F52',
  $neutral4: '#9EA1A6',
  $neutral5: '#F0F0F0',
  $neutral6: '#FAFAFA',

  $primaryAccent: '#2997FF',
  $primarySurface: '#00498F',
  $primaryContrast: '#C2E1FF',
  $primaryHighContrast: '#DBEDFF',

  $secondaryAccent: '#ED098F',
  $secondarySurface: '#A30662',
  $secondaryContrast: '#FB93D0',
  $secondaryHighContrast: '#FDC4E5',

  $tertiaryAccent: '#9D00FF',
  $tertiarySurface: '#6400A3',
  $tertiaryContrast: '#C870FF',
  $tertiaryHighContrast: '#E7C2FF',

  $borderDefault: '#303030',
  $borderSubtle: '#323232',
  $borderContrast: '#9EA1A6',

  $layoutSurfaceDefault: '#050505',
  $layoutSurfaceSubtle: '#1A1A1A',
  $layoutSurfaceContrast: '#000000',
  $layoutSurfaceOverlay: '#C8C8C8',

  $infoAccent: '#2997FF',
  $infoSurface: '#00264A',
  $infoContrast: '#CCE6FF',
  $infoHighContrast: '#DBEDFF',

  $positiveAccent: '#5EEA15',
  $positiveSurface: '#0E2900',
  $positiveContrast: '#CBFFB3',
  $positiveHighContrast: '#E5FFD8',

  $warningAccent: '#FF9900',
  $warningSurface: '#311E00',
  $warningContrast: '#FFD799',
  $warningHighContrast: '#FFE7C2',

  $negativeAccent: '#FF3338',
  $negativeSurface: '#340005',
  $negativeContrast: '#FFCCD1',
  $negativeHighContrast: '#FFE7E5',

  $disabledContrast: '#5F6164',
});

export type ColorType =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'info'
  | 'positive'
  | 'warning'
  | 'negative';
