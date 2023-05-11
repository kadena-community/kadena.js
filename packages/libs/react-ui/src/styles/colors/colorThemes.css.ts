import { createTheme, createThemeContract } from '@vanilla-extract/css';

// NOTE: When themes are introduced, autocomplete stops working
export const colorVars = createThemeContract({
  color: {
    neutral1: null,
    neutral2: null,
    neutral3: null,
    neutral4: null,
    neutral5: null,
    neutral6: null,

    primaryAccent: null,
    primarySurface: null,
    primaryContrast: null,
    primaryHighContrast: null,

    secondaryAccent: null,
    secondarySurface: null,
    secondaryContrast: null,
    secondaryHighContrast: null,

    positiveAccent: null,
    positiveSurface: null,
    positiveContrast: null,
    positiveHighContrast: null,

    warningAccent: null,
    warningSurface: null,
    warningContrast: null,
    warningHighContrast: null,

    negativeAccent: null,
    negativeSurface: null,
    negativeContrast: null,
    negativeHighContrast: null,
  },
});

export const lightTheme = createTheme(
  colorVars,
  {
    color: {
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
      secondaryContrast: '#8A0553',
      secondaryHighContrast: '#580335',

      positiveAccent: '#5EEA15',
      positiveSurface: '#E5FFD8',
      positiveContrast: '#226600',
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
  },
  'lightDebugId',
);

export const darkTheme = createTheme(
  colorVars,
  {
    color: {
      neutral1: '#050505',
      neutral2: '#1D1D1F',
      neutral3: '#474F52',
      neutral4: '#9EA1A6',
      neutral5: '#F0F0F0',
      neutral6: '#FAFAFA',

      primaryAccent: '#2997FF',
      primarySurface: '#00498F',
      primaryContrast: '#27B7E6',
      primaryHighContrast: '#B1E5F6',

      secondaryAccent: '#ED098F',
      secondarySurface: '#580335',
      secondaryContrast: '#8A0553',
      secondaryHighContrast: '#FDC4E5',

      positiveAccent: '#5EEA15',
      positiveSurface: '#113300',
      positiveContrast: '#226600',
      positiveHighContrast: '#E5FFD8',

      warningAccent: '#FF9900',
      warningSurface: '#3D2500',
      warningContrast: '#704300',
      warningHighContrast: '#FFE7C2',

      negativeAccent: '#FF3338',
      negativeSurface: '#410006',
      negativeContrast: '#75000B',
      negativeHighContrast: '#FFDAD8',
    },
  },
  'darkDebugId',
);
