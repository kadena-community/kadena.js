import { style } from '@vanilla-extract/css';
import { atoms, bodyBaseBold, token } from '../../styles';

export const accordionSectionClass = style({
  display: 'block',
  marginBlockEnd: token('spacing.md'),
  overflow: 'hidden',
  borderBlockEnd: `1px solid ${token('color.border.base.default')}`,
  selectors: {
    '&:last-child': {
      marginBlockEnd: 0,
    },
  },
});

export const accordionButtonClass = style([
  bodyBaseBold,
  atoms({
    display: 'flex',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    color: 'text.subtle.default',
    cursor: 'pointer',
    justifyContent: 'space-between',
    paddingBlockEnd: 'sm',
    paddingInlineStart: 'xs',
    textAlign: 'left',
    width: '100%',
  }),
]);

export const accordionToggleIconClass = style({
  color: token('color.text.subtle.default'),
  transform: 'rotate(45deg)',
  transition: 'transform 0.2s ease',
  selectors: {
    "&[data-open='true']": {
      transform: 'rotate(90deg)',
    },
  },
});

export const accordionContentClass = style([
  atoms({
    display: 'none',
    color: 'text.subtle.default',
    fontSize: 'base',
    margin: 'no',
    overflow: 'hidden',
    paddingBlockEnd: 'sm',
  }),
  {
    selectors: {
      "&[data-open='true']": {
        display: 'block',
      },
    },
  },
]);
