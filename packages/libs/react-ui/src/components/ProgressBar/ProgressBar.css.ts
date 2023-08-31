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
      borderColor: '$infoAccent',
    }),
  ],
  pending: [
    sprinkles({
      borderColor: '$negativeAccent',
    }),
  ],
  incomplete: [
    sprinkles({
      borderColor: '$borderContrast',
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
  {
    gap: '2px',
  },
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
  {
    flex: 1,
  },
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
    borderWidth: '$sm',
    borderStyle: 'dashed',
  }),
  {
    width: '2px',
    flex: 1,
  },
]);

export const lineContainerStyle = style([
  sprinkles({
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
    gap: '$2',
    height: '$sm',
  }),
  {
    marginLeft: '5px',
    alignSelf: 'stretch',
  },
]);

export const gapLineContainerStyle = style([
  sprinkles({
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
    gap: '$2',
    height: '$sm',
  }),
  {
    marginLeft: '5px',
    alignSelf: 'stretch',
  },
]);

export const circleLineContainerStyle = style([
  sprinkles({
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexDirection: 'column',
    gap: '$1',
  }),
  {
    alignSelf: 'stretch',
  },
]);
