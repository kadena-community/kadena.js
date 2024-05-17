import { globalStyle, style, styleVariants } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { token, uiBaseBold, uiSmallestBold } from '../../styles';
import { atoms } from '../../styles/atoms.css';

export const tabsContainerClass = style([
  atoms({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    position: 'relative',
  }),
]);

export const scrollContainer = style([
  atoms({
    overflowX: 'auto',
    display: 'flex',
    flexDirection: 'row',
  }),
  {
    scrollbarWidth: 'none',
    position: 'relative',
    paddingTop: '2px', // For focus ring
    selectors: {
      '&.paginationLeft:not(.paginationRight)': {
        maskImage:
          'linear-gradient(90deg,rgba(255,255,255,0) 32px, rgba(255,255,255,1) 64px)',
      },
      '&.paginationRight:not(.paginationLeft)': {
        maskImage:
          'linear-gradient(90deg,rgba(255,255,255,1) calc(100% - 32px),transparent)',
      },
      '&.paginationLeft.paginationRight': {
        maskImage:
          'linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0) 32px,rgba(255,255,255,1) 96px,rgba(255,255,255,1) calc(100% - 32px), transparent)',
      },
    },
  },
]);

export const tabListControls = style([
  atoms({
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
    width: '100%',
  }),
  {
    maxWidth: '100%',
    ':before': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: 0,
      borderBottom: `2px solid ${token('color.border.base.subtle')}`,
    },
  },
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
    bottom: 0,
    borderStyle: 'solid',
  }),
  {
    width: 0,
    height: 0,
    zIndex: 4,
    borderWidth: 0,
    borderBottomWidth: token('border.width.normal'),
    borderColor: token('color.border.tint.@focus'),
    transition: 'transform .4s ease, width .4s ease',
    transform: `translateX(0)`,
  },
]);

// To prevent overlapping with the focus ring, we hide the line when the tab is focused
globalStyle(`${tabListClass}.focusVisible ${selectorLine}`, {
  opacity: 0,
});

export const tabItemClass = recipe({
  base: [
    atoms({
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      paddingBlock: 'n2',
      paddingInline: 'n4',
      gap: 'n2',
      fontSize: 'md',
      fontWeight: 'secondaryFont.bold',
      backgroundColor: 'transparent',
      color: 'text.base.default',
      outline: 'none',
    }),
    {
      zIndex: 3,
      borderBlock: `2px solid transparent`,
      borderTopLeftRadius: token('radius.xs'),
      borderTopRightRadius: token('radius.xs'),
      transition:
        'background-color .4s ease, color .4s, border-bottom .4s ease-in-out',
      whiteSpace: 'nowrap',
      selectors: {
        '&[data-selected="true"]': {
          backgroundColor: token('color.background.base.@active'),
          color: token('color.text.base.@active'),
        },
        '&[data-hovered="true"]': {
          color: token('color.text.base.@hover'),
        },
        '.focusVisible &:focus-visible': {
          outline: `2px solid ${token('color.border.tint.outline')}`,
          borderRadius: token('radius.xs'),
          outlineOffset: '-2px',
        },
        '&.closeable': { paddingInlineEnd: token('size.n2') },
      },
    },
  ],
  variants: {
    inverse: {
      true: {
        selectors: {
          '&[data-hovered="true"]': {
            backgroundColor: token('color.background.base.@hover'),
          },
          '&[data-selected="true"]': {
            backgroundColor: token('color.background.base.default'),
          },
        },
      },
      false: {
        selectors: {
          '&[data-hovered="true"]': {
            backgroundColor: token('color.background.base.@hover'),
          },
          '&[data-selected="true"]': {
            backgroundColor: token('color.background.base.@active'),
          },
        },
      },
    },
    borderPosition: {
      top: {
        selectors: {
          '&[data-selected="true"]': {
            borderTop: `2px solid ${token('color.border.tint.@focus')}`,
          },
          '&[data-hovered="true"]:not(&[data-selected="true"])': {
            borderTop: `2px solid ${token('color.border.tint.outline')}`,
          },
        },
      },
      bottom: {
        selectors: {
          '&[data-hovered="true"]:not(&[data-selected="true"])': {
            borderBottom: `2px solid ${token('color.border.tint.outline')}`,
          },
        },
      },
    },
    size: {
      default: uiBaseBold,
      compact: uiSmallestBold,
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

const paginationButtonBase = style({
  zIndex: 3,
  opacity: 1,
  transition: 'opacity 0.4s ease, background 0.4s ease',
  backgroundColor: 'inherit',
});

export const paginationButton = styleVariants({
  left: [
    paginationButtonBase,
    atoms({ position: 'absolute', left: 0, top: 0, bottom: 0 }),
  ],
  right: [paginationButtonBase],
});

export const hiddenClass = style({
  opacity: 0,
  transition: 'opacity 0.4s ease',
  pointerEvents: 'none',
});

export const closeButtonClass = style({
  paddingBlock: token('size.n1'),
  opacity: 0,
  outlineOffset: '-2px',
  cursor: 'pointer',
  selectors: {
    '&[data-parent-hovered="true"]': {
      transition: 'opacity 0.4s ease',
      opacity: 1,
    },
    '&[data-parent-selected="true"]': {
      transition: 'opacity 0.4s ease',
      opacity: 1,
    },
  },
});
