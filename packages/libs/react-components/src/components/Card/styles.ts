/* eslint @kadena-dev/typedef-var: 0 */

import { styled } from '../../styles';

import { VariantProps } from '@stitches/react';

export const StyledCard = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '$lg',
  width: 'max-content',
  height: 'max-content',
  boxShadow: '$card',
  borderRadius: '$lg',
  variants: {
    color: {
      default: {
        backgroundColor: '$defaultSurface',
        color: '$defaultContrast',
      },
      negative: {
        backgroundColor: '$neutral5',
        color: '$neutral2',
        h4: {
          color: '$neutral2',
        },
      },
    },
    expand: {
      true: { width: '100%', height: '100%' },
      false: { width: 'max-content', height: 'max-content' },
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

export type CardColor = VariantProps<typeof StyledCard>['color'];

export const CardColors: { [key: string]: CardColor } = {
  Default: 'default',
  Negative: 'negative',
};
