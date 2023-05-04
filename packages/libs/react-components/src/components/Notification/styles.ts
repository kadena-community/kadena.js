import { IconButton } from '../..';
import { styled } from '../../styles';
import { colors } from '../../styles/colors';
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

export type ColorKeys = keyof typeof colors;
export const StyledNotification = styled('div', {
  boxSizing: 'border-box',

  /* Auto layout */
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',

  width: 'max-content',
  height: 'min-content',

  border: '1px solid $foreground',
  borderLeft: '$sizes$1 solid $foreground',
  padding: '$md',

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
        //padding: '$md',
        borderRadius: '$radii$md',
        borderLeft: '1px solid $foreground',
      },
      full: {},
    },
  },
});

export const StyledNotificationColumns = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  padding: '$4 $3',
  gap: '$lg',

  width: '100%',
  height: '100%',
});

export const StyledNotificationBody = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'center',

  variants: {
    isSimple: {
      true: { flexDirection: 'row' },
    },
  },
});

export const StyledButtonArea = styled('div', {
  //marginTop: '$lg',
});

export const Col = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: 'min-content',
  //minWidth: '$2xl',
  //border: '1px solid red',
  height: '100%',
  margin: '0',
  variants: {
    type: {
      body: {
        width: '100%',
      },
    },
  },
});

export const Row = styled('div', {
  display: 'flex',
  margin: '0px $sm',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  width: 'max-content',
  height: '100%',
  //border: '1px solid purple',
  variants: {
    type: {
      body: {
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
      },
      masterRow: {
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        margin: '0',
        width: '100%',
      },
      simple: {},
    },
  },

  // StyledHeading
  '> h6': {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    margin: '0',
  },
});

export const StyledHeading = styled(Heading, {
  marginBottom: '$xs',
  height: '100%',
  display: 'flex',
  flexWrap: 'nowrap',
  justifyContent: 'center',
  alignItems: 'center',
});

export const StyledButton = styled(Button, {
  marginTop: '$md',
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
