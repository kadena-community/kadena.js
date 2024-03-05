/* eslint @kadena-dev/typedef-var: 0 */
import { styled } from '../../styles';

export const fullWidthVariant = {
  true: { width: '100%', height: '100%' },
  false: { width: 'max-content', height: 'max-content' },
};

export const stackVariant = {
  true: {
    margin: 0,
    borderRadius: 0,
    '&:not(:last-child)': {
      borderBottom: '1px solid $neutral3',
    },
    '&:first-child': {
      borderRadius: '$sm $sm 0 0',
    },
    '&:last-child': {
      borderRadius: '0 0 $sm $sm',
    },
  },
  false: {
    margin: '$md 0',
  },
};

export const StyledCard = styled('div', {
  backgroundColor: '$neutral2',
  color: '$neutral6',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '$lg',
  width: 'max-content',
  height: 'max-content',
  borderRadius: '$sm',
  variants: {
    fullWidth: fullWidthVariant,
    stack: stackVariant,
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
