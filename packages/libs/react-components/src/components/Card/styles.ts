/* eslint @kadena-dev/typedef-var: 0 */

import { styled } from '../../styles';

export const colorVariant = {
  default: {
    backgroundColor: '$neutral1',
    color: '$neutral6',
  },
  negative: {
    backgroundColor: '$neutral6',
    color: '$neutral1',
    h4: {
      color: '$neutral1',
    },
  },
};

export const expandVariant = {
  true: { width: '100%', height: '100%' },
  false: { width: 'max-content', height: 'max-content' },
};

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
    color: colorVariant,
    expand: expandVariant,
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
