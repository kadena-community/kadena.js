/* eslint @kadena-dev/typedef-var: 0 */

import { styled } from '../../styles';

export enum CardColors {
  Default = 'default',
  Accent = 'accent',
}

export const StyledCard = styled('div', {
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
      accent: {
        backgroundColor: '$colors$neutral2',
        color: '$contrast',
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
