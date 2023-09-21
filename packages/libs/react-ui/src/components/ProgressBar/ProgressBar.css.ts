import { colorPalette, sprinkles } from '@theme';
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
    {
      backgroundImage: `linear-gradient(${colorPalette.$blue60} 33%, rgba(255,255,255,0) 0%)`,
    },
  ],
  pending: [
    {
      backgroundImage: `linear-gradient(${colorPalette.$red60} 33%, rgba(255,255,255,0) 0%)`,
    },
  ],
  incomplete: [
    {
      backgroundImage: `linear-gradient(${colorPalette.$gray40} 33%, rgba(255,255,255,0) 0%)`,
    },
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
    height: '100%',
  }),
]);

export const progressBarContentStyle = style([
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
    paddingTop: '$1',
    marginBottom: '$lg',
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

export const circleLineContainerStyle = style([
  sprinkles({
    width: '$2',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexDirection: 'column',
    gap: '$1',
  }),
  {
    alignSelf: 'stretch',
    paddingTop: '6px',
  },
  {
    selectors: {
      '&:first-child': {
        paddingTop: '$1',
      },
      '&:last-child': {
        paddingBottom: '$1',
      },
    },
  },
]);

export const lineStyle = style([
  sprinkles({
    width: '$1',
    position: 'relative',
  }),
  {
    top: 0,
    bottom: 0,
    left: '5px',
    flex: 1,

    backgroundPosition: 'left',
    backgroundSize: '1px 10px',
    backgroundRepeat: 'repeat-y',
  },
]);
