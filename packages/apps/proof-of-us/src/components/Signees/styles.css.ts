import { atoms, tokens } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const itemClass = style([
  atoms({
    padding: 'md',
    flexDirection: 'column',
    alignItems: 'center',
  }),
  {
    flex: '1 1 50%',
    width: '50%',
    selectors: {
      '&:first-child': {
        background: 'rgba(255,255,255,.1)',
        borderTopLeftRadius: tokens.kda.foundation.radius.md,
        borderBottomLeftRadius: tokens.kda.foundation.radius.md,
        border: '1px solid rgba(255,255,255,.2)',
        borderInlineEnd: '0',
      },
      '&:last-child': {
        background: 'rgba(255,255,255,.2)',
        borderTopRightRadius: tokens.kda.foundation.radius.md,
        borderBottomRightRadius: tokens.kda.foundation.radius.md,
        border: '1px solid rgba(255,255,255,.2)',
      },
    },
  },
]);

export const titleClass = style([
  atoms({
    width: '100%',
    fontWeight: 'secondaryFont.bold',
  }),
]);

export const bulletClass = style([
  atoms({
    borderRadius: 'round',
    marginInlineEnd: 'sm',
  }),
  {
    width: '1.2rem',
    height: '1.2rem',
    aspectRatio: '1/1',
    backgroundColor: 'var(--bulletColor)',

    selectors: {
      '&:before': {
        display: 'block',
        margin: '.2rem',
        border: '2px solid white',
        content: '',
        borderRadius: '50%',
        width: '.8rem',
        height: '.8rem',
        aspectRatio: '1/1',
        background: 'var(--bulletColor)',
      },
    },
  },
]);

export const bulletPositionClass = style([
  atoms({
    position: 'absolute',
    borderRadius: 'round',
    margin: 'no',
    padding: 'no',
  }),
  {
    border: 0,
    width: '4.5rem',
    height: '4.5rem',
    aspectRatio: '1/1',
    zIndex: 100,

    selectors: {
      '&:before': {
        display: 'block',
        margin: '.5rem',
        border: '4px solid white',
        content: '',
        borderRadius: '50%',
        width: '3.5rem',
        height: '3.5rem',
        aspectRatio: '1/1',
      },
      '&[data-position="0"]': {
        background: 'rgba(255, 0, 0, 0.42)',
      },
      '&[data-position="1"]': {
        background: 'rgba(255, 199, 0, 0.42)',
      },
      '&[data-position="0"]:before': {
        background: 'rgba(255, 0, 0, 0.42)',
      },
      '&[data-position="1"]:before': {
        background: 'rgba(255, 199, 0, 0.42)',
      },
    },
  },
]);

export const smallClass = style({
  width: '2rem',
  height: '2rem',
  selectors: {
    '&:before': {
      border: '1px solid white',
      margin: '.425rem',
      width: '1.2rem',
      height: '1.2rem',
    },
  },
});

export const wrapperClass = style([
  atoms({}),
  {
    display: 'flex',
    width: '100%',
  },
]);

export const nameClass = style([
  {
    width: '100%',
    fontFamily: 'Kode Mono',
    opacity: '.6',
  },
]);

export const ellipsClass = style([
  {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
]);

export const overflowClass = style({
  overflowY: 'scroll',
});
