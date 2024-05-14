import { globalStyle, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { token } from '../../styles';
import { atoms } from '../../styles/atoms.css';

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
  {
    width: 'fit-content',
    maxWidth: '100%',
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
      paddingInline: 'md',
      fontSize: 'md',
      fontWeight: 'secondaryFont.bold',
      backgroundColor: 'transparent',
      color: 'text.base.default',
      outline: 'none',
    }),
    {
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
          outline: `2px solid ${token('color.border.tint.@focus')}`,
          outlineOffset: '-2px',
          zIndex: 4,
        },
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
        borderBottom: `2px solid ${token('color.border.base.subtle')}`,
        selectors: {
          '&[data-hovered="true"]:not(&[data-selected="true"])': {
            borderBottom: `2px solid ${token('color.border.tint.outline')}`,
          },
        },
      },
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
  opacity: 1,
  position: 'relative',
  transition: 'opacity 0.4s ease, background 0.4s ease',
});

export const hiddenClass = style({
  opacity: 0,
  transition: 'opacity 0.4s ease',
  pointerEvents: 'none',
});
