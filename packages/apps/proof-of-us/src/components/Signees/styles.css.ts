import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const listClass = style([
  atoms({
    display: 'flex',
    padding: 'no',
    width: '100%',
    marginBlockEnd: 'md',
  }),
  {
    listStyle: 'none',
  },
]);
export const itemClass = style([
  atoms({
    flex: 1,
    padding: 'md',
  }),
  {
    selectors: {
      '&:first-child': {
        background: 'rgba(255,255,255,.1)',
      },
      '&:last-child': {
        background: 'rgba(255,255,255,.2)',
      },
    },
  },
]);
export const titleClassWrapper = style([
  {
    flex: '1 1 100%',
    minWidth: '0',
  },
]);
export const titleClass = style([
  {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
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

export const bulletPositionClass = style([
  atoms({
    position: 'absolute',
    borderRadius: 'round',
  }),
  {
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
