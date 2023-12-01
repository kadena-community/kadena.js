import { sprinkles } from '@theme/sprinkles.css';
import { darkThemeClass, vars } from '@theme/vars.css';
import { style } from '@vanilla-extract/css';

export const tabsContainerClass = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
  }),
]);

export const tabListWrapperClass = style([
  sprinkles({
    maxWidth: '100%',
    overflowX: 'auto',
  }),
  {
    paddingLeft: '2px',
    paddingTop: '2px', // For focus ring
  },
]);

export const tabListClass = style([
  sprinkles({
    display: 'inline-flex',
    flexDirection: 'row',
    minWidth: '100%',
    position: 'relative',
  }),
  {
    selectors: {
      '&::before': {
        position: 'absolute',
        display: 'block',
        content: '',
        bottom: '0',
        left: '0',
        right: '0',
        height: '2px',
        backgroundColor: vars.colors.$neutral2,
      },
      [`${darkThemeClass} &::before`]: {
        backgroundColor: vars.colors.$neutral3,
      },
    },
  },
]);

export const tabItemClass = style([
  sprinkles({
    border: 'none',
    cursor: 'pointer',
    paddingY: '$1',
    paddingX: '$2',
    fontSize: '$md',
    fontWeight: '$semiBold',
    backgroundColor: 'transparent',
    color: '$neutral4',
    outline: 'none',
    zIndex: 1,
  }),
  {
    opacity: '.6',
    whiteSpace: 'nowrap',
    selectors: {
      '&[data-selected="true"]': {
        opacity: '1',
        color: vars.colors.$primaryContrastInverted,
      },
      '.focusVisible &:focus-visible': {
        borderTopLeftRadius: vars.radii.$sm,
        borderTopRightRadius: vars.radii.$sm,
        outline: `2px solid ${vars.colors.$primaryAccent}`,
      },
    },
  },
]);

export const selectorLine = style([
  sprinkles({
    position: 'absolute',
    display: 'block',
    width: 0,
    height: '100%',
    bottom: 0,
    borderStyle: 'solid',
    borderColor: '$primaryAccent',
  }),
  {
    borderWidth: 0,
    borderBottomWidth: '2px',
    transition: 'transform .4s ease, width .4s ease',
    transform: `translateX(0)`,
  },
]);

export const tabContentClass = style([
  sprinkles({
    marginY: '$4',
    fontSize: '$base',
    color: '$neutral4',
    flex: 1,
    overflowY: 'auto',
  }),
]);
