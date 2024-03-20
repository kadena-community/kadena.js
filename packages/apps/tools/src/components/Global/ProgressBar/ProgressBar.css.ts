import { atoms, tokens } from '@kadena/react-ui/styles';
import { style, styleVariants } from '@vanilla-extract/css';

export const circleColorVariant = styleVariants({
  complete: [
    {
      backgroundColor: tokens.kda.foundation.color.accent.blue,
    },
  ],
  pending: [
    {
      backgroundColor: tokens.kda.foundation.color.accent.red,
    },
  ],
  incomplete: [
    {
      border: `2px solid ${tokens.kda.foundation.color.neutral.n30}`,
    },
  ],
});

export const lineColorVariant = styleVariants({
  complete: [
    {
      backgroundImage: `linear-gradient(${tokens.kda.foundation.color.accent.blue} 33%, rgba(255,255,255,0) 0%)`,
    },
  ],
  pending: [
    {
      backgroundImage: `linear-gradient(${tokens.kda.foundation.color.accent.red} 33%, rgba(255,255,255,0) 0%)`,
    },
  ],
  incomplete: [
    {
      backgroundImage: `linear-gradient(${tokens.kda.foundation.color.neutral.n30} 33%, rgba(255,255,255,0) 0%)`,
    },
  ],
});

export const textColorVariant = styleVariants({
  complete: [
    atoms({
      color: 'text.gray.default',
    }),
  ],
  pending: [
    atoms({
      color: 'text.gray.default',
    }),
  ],
  incomplete: [
    {
      color: tokens.kda.foundation.color.neutral.n30,
    },
  ],
});

export const progressBarStyle = style([
  atoms({
    display: 'flex',
    height: '100%',
    marginBlockStart: 'lg',
  }),
]);

export const progressBarContentStyle = style([
  atoms({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginInlineStart: 'xs',
  }),
]);

export const checkpointContainerStyle = style([
  atoms({
    display: 'flex',
    alignItems: 'center',
    gap: 'md',
  }),
  {
    alignSelf: 'stretch',
  },
]);

export const textContainerStyle = style([
  atoms({
    fontSize: 'xs',
    fontFamily: 'primaryFont',
    fontWeight: 'secondaryFont.regular',
    lineHeight: 'base',
    paddingBlockStart: 'xs',
    marginBlockEnd: 'lg',
    flex: 1,
  }),
]);

export const circleStyle = style([
  atoms({
    borderRadius: 'round',
  }),
  {
    width: tokens.kda.foundation.size.n3,
    height: tokens.kda.foundation.size.n3,
  },
]);

export const circleLineContainerStyle = style([
  atoms({
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexDirection: 'column',
    gap: 'xs',
  }),
  {
    width: tokens.kda.foundation.size.n3,
    alignSelf: 'stretch',
    paddingTop: '6px',
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
  atoms({
    position: 'relative',
    top: 0,
    bottom: 0,
  }),
  {
    width: tokens.kda.foundation.size.n1,
    left: '5px',
    flex: 1,

    backgroundPosition: 'left',
    backgroundSize: '1px 10px',
    backgroundRepeat: 'repeat-y',
  },
]);
