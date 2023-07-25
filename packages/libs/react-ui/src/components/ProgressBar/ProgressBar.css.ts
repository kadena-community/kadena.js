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
    {
      border: '2px solid #9EA1A6',
    },
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
    color: '$neutral6',
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
    width: '$1',
  }),
]);

export const lineContainerStyle = style([
  sprinkles({
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
    gap: '$1',
    height: '$6',
    marginLeft: '$1',
  }),
  {
    alignSelf: 'stretch',
  },
]);

export const dottedLine = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: '$2',
    width: '$1',
    height: '$1',
    backgroundColor: '$infoAccent',
  }),
]);
