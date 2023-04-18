/* eslint @kadena-dev/typedef-var: 0 */
import { neutral } from './neutral';

export const colors = {
  ...neutral,

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

  successAccent: '#5EEA15',
  successSurface: '#E5FFD8',
  successContrast: '#113300',

  errorAccent: '#FF3338',
  errorSurface: '#FFDAD8',
  errorContrast: '#410006',
} as const;

export const colorsDark = {
  ...neutral,

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
  secondarySurface: '#8A0553',
  secondaryContrast: '#FDC4E5', // TODO: Replace this with highlighter color

  successAccent: '#5EEA15',
  successSurface: '#113300',
  successContrast: '#E5FFD8',

  errorAccent: '#FF3338',
  errorSurface: '#410006',
  errorContrast: '#FFDAD8',
};
