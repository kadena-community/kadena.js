import { sprinkles } from '@theme/sprinkles.css';
import { style, styleVariants } from '@vanilla-extract/css';

export const circleColorVariant = styleVariants({
  complete: [
    sprinkles({
      backgroundColor: '$infoAccent',
    }),
  ],
  pending: [
    sprinkles({
      backgroundColor: '$negativeAccent',
    }),
  ],
  incomplete: [
    sprinkles({
      borderWidth: '$md',
      borderColor: '$neutral3',
      borderStyle: 'solid',
    }),
  ],
});

export const lineColorVariant = styleVariants({
  complete: [
    sprinkles({
      backgroundColor: '$infoAccent',
    }),
  ],
  pending: [
    sprinkles({
      backgroundColor: '$negativeAccent',
    }),
  ],
  incomplete: [
    sprinkles({
      backgroundColor: '$borderContrast',
    }),
  ],
});

export const textColorVariant = styleVariants({
  complete: [
    sprinkles({
      color: '$neutral6',
    }),
  ],
  pending: [
    sprinkles({
      color: '$neutral6',
    }),
  ],
  incomplete: [
    sprinkles({
      color: '$neutral3',
    }),
  ],
});

export const progressBarStyle = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    marginLeft: '$6',
  }),
]);

export const checkpointContainerStyle = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    gap: '$4',
  }),
  {
    alignSelf: 'stretch',
  },
]);

export const textContainerStyle = style([
  sprinkles({
    fontSize: '$xs',
    fontFamily: '$main',
    fontWeight: '$normal',
    lineHeight: '$base',
  }),
]);

export const circleStyle = style([
  sprinkles({
    borderRadius: '$round',
    width: '$sm',
    height: '$sm',
  }),
]);

export const lineStyle = style([
  sprinkles({
    borderRadius: '$sm',
    height: '$2',
  }),
  {
    width: '2px',
  },
]);

export const lineContainerStyle = style([
  sprinkles({
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
    gap: '$1',
    height: '$6',
  }),
  {
    marginLeft: '5px',
    alignSelf: 'stretch',
  },
]);
