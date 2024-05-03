import { style, styleVariants } from '@vanilla-extract/css';
import { token } from '../../styles';
import { atoms } from '../../styles/atoms.css';
import { tokens } from '../../styles/tokens/contract.css';

export const tabsContainerClass = style([
  atoms({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  }),
]);

export const tabListWrapperClass = style([
  atoms({
    overflowX: 'auto',
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
  }),
  {
    scrollbarWidth: 'none',
    paddingLeft: '2px',
    paddingTop: '2px', // For focus ring
  },
]);

export const tabListControls = style([
  atoms({
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
  }),
  { width: 'fit-content', maxWidth: '100%' },
]);

export const tabListClass = style([
  atoms({
    display: 'inline-flex',
    flexDirection: 'row',
    position: 'relative',
  }),
  {
    minWidth: '100%',
  },
]);

export const selectorLine = style([
  atoms({
    position: 'absolute',
    display: 'block',
    height: '100%',
    bottom: 0,
    borderStyle: 'solid',
  }),
  {
    width: 0,
    borderWidth: 0,
    borderBottomWidth: token('border.width.normal'),
    borderColor: token('color.border.tint.@focus'),
    transition: 'transform .4s ease, width .4s ease',
    transform: `translateX(0)`,
  },
]);

export const tabItemClass = style([
  atoms({
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    paddingBlock: 'n2',
    paddingInline: 'md',
    fontSize: 'md',
    fontWeight: 'secondaryFont.bold',
    backgroundColor: 'transparent',
    color: 'text.base.default',
    outline: 'none',
    borderRadius: 'xs',
  }),
  {
    transition:
      'background-color .4s ease, color .4s, border-bottom .4s ease-in-out',
    borderBottom: `2px solid ${token('color.border.base.subtle')}`,
    whiteSpace: 'nowrap',
    selectors: {
      '&[data-selected="true"]': {
        backgroundColor: token('color.background.base.@active'),
        color: token('color.text.base.@active'),
      },
      '&[data-hovered="true"]': {
        backgroundColor: token('color.background.base.@hover'),
        color: token('color.text.base.@hover'),
      },
      '&[data-hovered="true"]:not(&[data-selected="true"])': {
        borderBottom: `2px solid ${token('color.border.tint.outline')}`,
      },
      '.focusVisible &:focus-visible': {
        outline: `2px solid ${tokens.kda.foundation.color.accent.brand.primary}`,
      },
    },
  },
]);

export const tabItemIconClass = style({
  transition: 'color .4s ease',
  selectors: {
    [`${tabItemClass}[data-selected="true"] &`]: {
      color: token('color.icon.base.@active'),
    },
    [`${tabItemClass}[data-hovered="true"] &`]: {
      color: token('color.icon.base.@hover'),
    },
  },
});

export const tabContentClass = style([
  atoms({
    marginBlock: 'md',
    fontSize: 'base',
    color: 'text.base.default',
    flex: 1,
    overflowY: 'auto',
  }),
]);

export const paginationButton = style({
  zIndex: 3,
  backgroundColor: token('color.background.base.default'),
});

export const hiddenClass = style({ visibility: 'hidden' });

const baseFade = style({
  position: 'relative',
  selectors: {
    '&::before': {
      zIndex: 2,
      content: '""',
      position: 'absolute',
      top: 0,
      width: '4rem',
      height: '100%',
      pointerEvents: 'none',
    },
  },
});

export const fade = styleVariants({
  back: [
    baseFade,
    {
      selectors: {
        '&::before': {
          left: '100%',
          background: `linear-gradient(90deg, ${token('color.background.base.default')}, ${token('color.neutral.n1@alpha0')})`,
        },
      },
    },
  ],
  forward: [
    baseFade,
    {
      selectors: {
        '&::before': {
          right: '100%',
          background: `linear-gradient(90deg, ${token('color.neutral.n1@alpha0')}, ${token('color.background.base.default')})`,
        },
      },
    },
  ],
});
