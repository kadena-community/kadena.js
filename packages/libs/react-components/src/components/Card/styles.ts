/* eslint @kadena-dev/typedef-var: 0 */

import { styled } from '../../styles';

export const CardColors: string[] = [
  'default',
  'primary',
  'secondary',
  'positive',
  'warning',
  'negative',
];

export const StyledCard = styled('div', {
  boxSizing: 'border-box',
  backgroundColor: '$colors$neutral1',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '24px',
  minWidth: '546px',
  width: 'min-content',
  height: 'min-content',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.04)',
  borderRadius: '8px',
  variants: {
    color: {
      default: {
        backgroundColor: '$colors$defaultSurface',
        color: '$colors$defaultContrast',
      },
      primary: {
        backgroundColor: '$colors$primarySurface',
        color: '$colors$neutral5',
      },
      secondary: {
        backgroundColor: '$colors$secondarySurface',
        color: '$colors$neutral5',
      },
      positive: {
        backgroundColor: '$colors$positiveSurface',
        color: '$colors$neutral5',
      },
      warning: {
        backgroundColor: '$colors$warningSurface',
        color: '$colors$neutral5',
      },
      negative: {
        backgroundColor: '$colors$negativeSurface',
        color: '$colors$neutral5',
      },
    },
    expand: {
      true: { width: '100%' },
      height: { width: '100%' },
    },
  },
});

export const StyledCardHeader = styled('div', {
  width: '100%',
  fontFamily: '$main',
  fontStyle: 'normal',
  fontWeight: '700',
  fontSize: '20px',
});

export const StyledCardBody = styled('div', {
  width: '100%',
  fontFamily: '$main',
  fontWeight: '$normal',
  fontSize: '$base',
  lineHeight: '$base',
  marginTop: '20px',
});

export const StyledCardFooter = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  padding: '24px 0px 0px',
  gap: '$sm',
  width: '100%',
});
