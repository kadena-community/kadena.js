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
  backgroundColor: '$neutral1',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '$lg',
  width: 'max-content',
  height: 'max-content',
  boxShadow: '$shadows$card',
  borderRadius: '$radii$lg',
  variants: {
    color: {
      default: {
        backgroundColor: '$defaultSurface',
        color: '$defaultContrast',
      },
      primary: {
        backgroundColor: '$primarySurface',
        color: '$neutral5',
      },
      secondary: {
        backgroundColor: '$secondarySurface',
        color: '$neutral5',
      },
      positive: {
        backgroundColor: '$positiveSurface',
        color: '$neutral5',
      },
      warning: {
        backgroundColor: '$warningSurface',
        color: '$neutral5',
      },
      negative: {
        backgroundColor: '$negativeSurface',
        color: '$neutral5',
      },
    },
    expand: {
      true: { width: '100%', height: '100%' },
    },
  },
});

export const StyledCardBody = styled('div', {
  width: '100%',
  fontFamily: '$main',
  fontWeight: '$normal',
  fontSize: '$base',
  lineHeight: '$base',
  marginTop: '$lg',
});

export const StyledCardFooter = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  paddingTop: '$lg',
  gap: '$sm',
  width: '100%',
});
