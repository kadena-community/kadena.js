import { sprinkles } from '../../styles';

import { style, styleVariants } from '@vanilla-extract/css';

export const CardContainer = style([
  sprinkles({
    display: 'grid',
    padding: '$3',
    gap: '$4',
    marginTop: '$sm',
    borderRadius: '$sm',
    flexDirection: 'column',
    alignItems: 'flex-start',
    fontSize: '$sm',
  }),
  {
    gridTemplateColumns: 'auto 1fr',
    boxSizing: 'border-box',
  },
]);

export const GridCardContainer = style([
  sprinkles({
    display: 'grid',
    gap: '$4',
  }),
  {
    gridTemplateColumns: 'auto 1fr',
  },
]);

export const TrackerInfoContainer = style([
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

export const TrackerContentContainer = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: '$2',
  }),
]);

export const TrackerInfoItemTitle = style([
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

export const TrackerInfoItemLine = style([
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
