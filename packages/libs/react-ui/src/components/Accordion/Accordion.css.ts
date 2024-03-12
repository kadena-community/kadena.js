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
    paddingInlineStart: 'sm',
    height: '100%',
    paddingBlock: 'no',
  }),
  {
    gridTemplateRows: '0fr',
    transition: 'all 300ms ease',
    transitionProperty: 'grid-template-rows, padding',
  },
]);

export const accordionContentOpenClass = style([
  atoms({
    paddingBlock: 'sm',
  }),
  {
    gridTemplateRows: '1fr',
  },
]);

export const accordionContentWrapperClass = style([{ minHeight: '0' }]);

export const rotatedIconClass = style([
  { transform: 'rotate(45deg)', transitionDuration: '0.3s' },
]);

export const defaultIconClass = style([
  { transform: 'rotate(0deg)', transitionDuration: '0.3s' },
]);
