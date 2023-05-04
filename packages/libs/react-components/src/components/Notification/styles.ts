import { IconButton } from '../..';
import { styled } from '../../styles';
import { Button } from '../Button';
import { Heading, Text } from '../Typography';

export const NotificationColors: string[] = [
  'default',
  'primary',
  'secondary',
  'positive',
  'warning',
  'negative',
];

export const StyledNotification = styled('div', {
  margin: '0px $sm',

  width: 'max-content',
  height: 'min-content',

  border: '1px solid $foreground',
  borderLeft: '$sizes$1 solid $foreground',

  display: 'flex',
  justifyContent: 'flex-start',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '$md calc(4 * $sm)',
  position: 'relative',

  variants: {
    color: {
      default: {
        backgroundColor: `$neutral2`,
        border: '1px solid $neutral6',
        color: '$defaultContrast',
      },
      primary: {
        backgroundColor: `$primarySurface`,
        border: '1px solid $primaryAccent',
        color: '$primaryAccent',
      },
      secondary: {
        backgroundColor: `$secondarySurface`,
        border: '1px solid $secondaryAccent',
        color: '$secondaryAccent',
      },
      positive: {
        backgroundColor: `$positiveSurface`,
        border: '1px solid $positiveAccent',
        color: '$positiveAccent',
      },
      warning: {
        backgroundColor: `$warningSurface`,
        border: '1px solid $warningAccent',
        color: '$warningAccent',
      },
      negative: {
        backgroundColor: `$negativeSurface`,
        border: '1px solid $negativeAccent',
        color: '$negativeAccent',
      },
    },

    expand: {
      true: { width: '100%', height: '100%', maxWidth: '100%' },
    },

    type: {
      simple: {
        borderRadius: '$radii$md',
        borderLeft: '1px solid $foreground',
      },
      full: {},
    },
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

export const StyledButton = styled(Button, {
  marginTop: '$md',
  marginLeft: '0',
});

export const StyledIconButton = styled(IconButton, {
  padding: '0',
  margin: '0',
  height: 'min-content',
  width: 'min-content',
});

export const StyledText = styled(Text, {
  textOverflow: 'wrap',
  width: '100%',
  margin: '$md 0',
});

export const AbsoluteButton = styled('div', {
  position: 'absolute',
  top: '$md',
  left: '0',
  right: '0',
  variants: {
    position: {
      left: {
        right: 'auto',
        left: '$sm',
      },
      right: {
        left: 'auto',
        right: '$sm',
      },
    },
  },
});
