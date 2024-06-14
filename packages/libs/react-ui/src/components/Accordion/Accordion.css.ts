import { atoms, bodyBaseBold, style, token } from '../../styles';

export const accordionSectionClass = style([
  {
    display: 'block',
    overflow: 'hidden',
    borderBlockEnd: `1px solid ${token('color.border.base.default')}`,
  },
]);

export const accordionButtonClass = style([
  bodyBaseBold,
  {
    display: 'flex',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    color: token('color.text.subtle.default'),
    cursor: 'pointer',
    justifyContent: 'space-between',
    paddingBlock: token('spacing.sm'),
    textAlign: 'left',
    width: '100%',
    gap: 'sm',
  },
]);

export const accordionContentClass = style([
  {
    display: 'grid',
    color: token('color.text.subtle.default'),
    fontSize: token('typography.fontSize.md'),
    margin: '0',
    overflow: 'hidden',
    paddingInlineStart: token('spacing.sm'),
    height: '100%',
    paddingBlock: '0',
    gridTemplateRows: '0fr',
    transition: 'all 300ms ease',
    transitionProperty: 'grid-template-rows, padding',
  },
]);

export const accordionContentOpenClass = style([
  {
    paddingBlock: token('spacing.sm'),
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
