import { style } from '@vanilla-extract/css';
import { atoms, bodyBaseBold, token } from '../../styles';
import { iconFill } from '../Icon/IconWrapper.css';

export const accordionSectionClass = style([
  atoms({
    display: 'block',
    overflow: 'hidden',
  }),
  {
    borderBlockEnd: `1px solid ${token('color.border.base.default')}`,
  },
]);

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
    paddingBlock: 'sm',
    textAlign: 'left',
    width: '100%',
    gap: 'sm',
  }),
  {
    color: token('color.text.subtle.default'),
    vars: {
      [iconFill]: token('color.text.subtle.default'),
    },
  },
]);

export const accordionContentClass = style([
  atoms({
    display: 'grid',
    color: 'text.subtle.default',
    fontSize: 'base',
    margin: 'no',
    overflow: 'hidden',
  }),
  {
    gridTemplateRows: '0',
    transition: 'grid-template-rows  0.2s ease',
    selectors: {
      "&[data-open='true']": {
        gridTemplateRows: '1fr',
        paddingBlock: token('spacing.sm'),
      },
    },
  },
]);
