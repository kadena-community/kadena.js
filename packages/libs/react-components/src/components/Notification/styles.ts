/* eslint @kadena-dev/typedef-var: 0 */
import { styled } from '../../styles';
import { Heading, Text } from '../Typography';

export const colorVariant = {
  default: {
    backgroundColor: '$neutral2',
    borderColor: '$neutral6',
    color: '$neutral6',
  },
  inverted: {
    backgroundColor: '$neutral6',
    borderColor: '$neutral2',
    color: '$neutral2',
  },
  primary: {
    backgroundColor: '$primarySurface',
    borderColor: '$primaryContrast',
    color: '$primaryContrast',
  },
  secondary: {
    backgroundColor: '$secondarySurface',
    borderColor: '$secondaryContrast',
    color: '$secondaryContrast',
  },
  positive: {
    backgroundColor: '$positiveSurface',
    borderColor: '$positiveContrast',
    color: '$positiveContrast',
  },
  warning: {
    backgroundColor: '$warningSurface',
    borderColor: '$warningContrast',
    color: '$warningContrast',
  },
  negative: {
    backgroundColor: '$negativeSurface',
    borderColor: '$negativeContrast',
    color: '$negativeContrast',
  },
};

export const expandVariant = {
  true: { width: '100%', maxWidth: '100%' },
  false: {},
};

export const simpleVariant = {
  true: {
    borderRadius: '$md',
    borderLeftWidth: '1px',
  },
  false: {},
};

export const StyledNotification = styled('div', {
  margin: '0px',

  width: 'max-content',
  height: 'min-content',

  border: '1px solid $foreground',
  borderLeftWidth: '$sizes$1',

  display: 'flex',
  justifyContent: 'flex-start',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '$md calc(4 * $sm)',
  position: 'relative',

  variants: {
    color: colorVariant,

    expand: expandVariant,

    simple: simpleVariant,
  },
});

export const StyledHeading = styled(Heading, {
  height: '100%',
  display: 'flex',
  flexWrap: 'nowrap',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '0',
});

export const StyledText = styled(Text, {
  textOverflow: 'wrap',
  width: '100%',
  margin: '$md 0',
});

const positionVariant = {
  left: {
    right: 'auto',
    left: '$sm',
  },
  right: {
    left: 'auto',
    right: '$sm',
  },
};

export const StyledIconContainer = styled('div', {
  margin: '0',
  padding: '0',
  height: 'min-content',
  width: 'min-content',
  position: 'absolute',
  top: '$md',
  left: '0',
  right: '0',
  variants: {
    position: positionVariant,
  },
});
