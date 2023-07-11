import { sprinkles } from '../../styles';

import { style, styleVariants } from '@vanilla-extract/css';

export const layoutVariant = styleVariants({
  horizontal: [
    sprinkles({
      flexDirection: 'row',
    }),
  ],
  vertical: [
    sprinkles({
      flexDirection: 'column',
    }),
  ],
});

export const gridVariant = styleVariants({
  horizontal: [
    sprinkles({}),
    {
      gridTemplateRows: 'auto 1fr',
    },
  ],
  vertical: [
    sprinkles({}),
    {
      gridTemplateColumns: 'auto 1fr',
    },
  ],
});

export const gapValueLabelVariant = styleVariants({
  horizontal: [
    sprinkles({
      gap: '$2',
    }),
  ],
  vertical: [
    sprinkles({
      gap: 0,
    }),
  ],
});

export const CardContainer = style([
  sprinkles({
    display: 'grid',
    padding: '$3',
    gap: '$4',
    marginTop: '$sm',
    borderRadius: '$sm',
    alignItems: 'flex-start',
    fontSize: '$sm',
    // width: '$1',
  }),
  {
    boxSizing: 'border-box',
  },
]);

// export const GridCardContainer = style([
//   sprinkles({
//     display: 'grid',
//     gap: '$4',
//   }),
//   {
//     gridTemplateColumns: 'auto 1fr',
//   },
// ]);
export const ContentContainer = style([
  sprinkles({
    display: 'flex',
    gap: '$2',
    flexDirection: 'column',
  }),
]);

export const DataContainer = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '$4',
  }),
  {
    flex: '1 0 0',
  },
]);

export const LabelValueContainer = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',

    gap: '$1',
  }),
  {
    flex: '1 0 0',
  },
]);

export const LabelTitle = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    fontSize: '$sm',
    fontWeight: '$medium',
  }),
  {
    alignSelf: 'stretch',
  },
]);

export const LabelValue = style([
  sprinkles({
    display: 'inline-block',
    fontWeight: '$normal',
    fontFamily: '$mono',
  }),
  {
    wordBreak: 'break-word',
  },
]);

export const TrackerWarningContainer = style([
  sprinkles({
    display: 'inline-block',
    flexDirection: 'column',
    alignItems: 'flex-start',
    fontWeight: '$normal',
    fontSize: '$xs',
  }),

  // {
  //   variants: {
  //     typedMessage: {
  //       mild: {
  //         color: '$warningContrast',
  //       },
  //       severe: {
  //         color: '$negativeContrast',
  //       },
  //     },
  //   },
  // },
]);
