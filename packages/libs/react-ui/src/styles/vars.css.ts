import { colorPalette, gradients, hexToRgba } from '@theme/colors';
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
    $1: `0px 1px 2px 0 $colors$gray40`,
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
    ...colorPalette,
    ...gradients,

    $background: colorPalette.$gray10,
    $foreground: colorPalette.$gray100,

    $neutral1: colorPalette.$gray10,
    $neutral2: colorPalette.$gray20,
    $neutral3: colorPalette.$gray40,
    $neutral4: colorPalette.$gray60,
    $neutral5: colorPalette.$gray90,
    $neutral6: colorPalette.$gray100,

    $primarySurface: colorPalette.$blue40,
    $primaryContrast: colorPalette.$blue80,
    $primaryHighContrast: colorPalette.$blue100,
    $primaryAccent: colorPalette.$blue60,

    $secondarySurface: colorPalette.$pink40,
    $secondaryContrast: colorPalette.$pink80,
    $secondaryHighContrast: colorPalette.$pink100,
    $secondaryAccent: colorPalette.$pink60,

    $tertiarySurface: colorPalette.$purple40,
    $tertiaryContrast: colorPalette.$purple80,
    $tertiaryHighContrast: colorPalette.$purple100,
    $tertiaryAccent: colorPalette.$purple60,

    $borderDefault: hexToRgba(colorPalette.$gray50, 0.2),
    $borderSubtle: hexToRgba(colorPalette.$gray40, 0.4),
    $borderContrast: colorPalette.$gray40,

    $layoutSurfaceDefault: colorPalette.$gray10,
    $layoutSurfaceSubtle: colorPalette.$gray20,
    $layoutSurfaceContrast: colorPalette.$white,
    $layoutSurfaceOverlay: hexToRgba(colorPalette.$gray90, 0.6),

    $infoSurface: colorPalette.$blue20,
    $infoContrast: colorPalette.$blue80,
    $infoHighContrast: colorPalette.$blue100,
    $infoAccent: colorPalette.$blue60,

    $warningSurface: colorPalette.$yellow20,
    $warningContrast: colorPalette.$yellow80,
    $warningHighContrast: colorPalette.$yellow100,
    $warningAccent: colorPalette.$yellow60,

    $negativeSurface: colorPalette.$red20,
    $negativeContrast: colorPalette.$red80,
    $negativeHighContrast: colorPalette.$red100,
    $negativeAccent: colorPalette.$red60,

    $positiveSurface: colorPalette.$green20,
    $positiveContrast: colorPalette.$green80,
    $positiveHighContrast: colorPalette.$green100,
    $positiveAccent: colorPalette.$green60,

    $disabledContrast: hexToRgba(colorPalette.$gray40, 0.6),
  },
});

export const darkThemeClass = createTheme(vars.colors, {
  ...colorPalette,
  ...gradients,

  $background: colorPalette.$gray100,
  $foreground: colorPalette.$gray10,

  $neutral1: colorPalette.$gray100,
  $neutral2: colorPalette.$gray90,
  $neutral3: colorPalette.$gray60,
  $neutral4: colorPalette.$gray40,
  $neutral5: colorPalette.$gray20,
  $neutral6: colorPalette.$gray10,

  $primarySurface: colorPalette.$blue80,
  $primaryContrast: colorPalette.$blue40,
  $primaryHighContrast: colorPalette.$blue20,
  $primaryAccent: colorPalette.$blue60,

  $secondarySurface: colorPalette.$pink80,
  $secondaryContrast: colorPalette.$pink40,
  $secondaryHighContrast: colorPalette.$pink20,
  $secondaryAccent: colorPalette.$pink60,

  $tertiarySurface: colorPalette.$purple80,
  $tertiaryContrast: colorPalette.$purple40,
  $tertiaryHighContrast: colorPalette.$purple20,
  $tertiaryAccent: colorPalette.$purple60,

  $borderDefault: hexToRgba(colorPalette.$gray20, 0.2),
  $borderSubtle: hexToRgba(colorPalette.$gray10, 0.2),
  $borderContrast: colorPalette.$gray40,

  $layoutSurfaceDefault: colorPalette.$gray100,
  $layoutSurfaceSubtle: colorPalette.$gray90,
  $layoutSurfaceContrast: colorPalette.$black,
  $layoutSurfaceOverlay: hexToRgba(colorPalette.$gray10, 0.8),

  $infoSurface: hexToRgba(colorPalette.$blue100, 0.8),
  $infoContrast: colorPalette.$blue30,
  $infoHighContrast: colorPalette.$blue20,
  $infoAccent: colorPalette.$blue60,

  $warningSurface: hexToRgba(colorPalette.$yellow100, 0.8),
  $warningContrast: colorPalette.$yellow30,
  $warningHighContrast: colorPalette.$yellow20,
  $warningAccent: colorPalette.$yellow60,

  $negativeSurface: hexToRgba(colorPalette.$red100, 0.8),
  $negativeContrast: colorPalette.$red30,
  $negativeHighContrast: colorPalette.$red20,
  $negativeAccent: colorPalette.$red60,

  $positiveSurface: hexToRgba(colorPalette.$green100, 0.8),
  $positiveContrast: colorPalette.$green30,
  $positiveHighContrast: colorPalette.$green20,
  $positiveAccent: colorPalette.$green60,

  $disabledContrast: hexToRgba(colorPalette.$gray40, 0.6),
});

export type ColorType =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'info'
  | 'positive'
  | 'warning'
  | 'negative';
