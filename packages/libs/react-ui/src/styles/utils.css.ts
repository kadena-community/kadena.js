import { style } from '@vanilla-extract/css';

export const ellipsis = style({
  fontFamily: 'unset',
  display: 'inline-block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  wordWrap: 'normal',
  selectors: {
    '&[data-lines]': {
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: 'attr(data-lines)',
      display: '-webkit-box',
      whiteSpace: 'normal',
    },
  },
});

export const rotate180Transition = style({
  transitionProperty: 'transform',
  transitionDuration: '100ms',
  transitionTimingFunction: 'ease-in-out',
  transform: 'rotate(0deg)',

  selectors: {
    "&[data-open='true']": {
      transform: ' rotate(180deg)',
    },
  },
});
