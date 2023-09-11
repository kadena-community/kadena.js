import { sprinkles } from '@theme/sprinkles.css';
import { darkThemeClass, vars } from '@theme/vars.css';
import { style } from '@vanilla-extract/css';

export const tabsContainer = style([
  sprinkles({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    marginBottom: '$4',
  }),
  {
    borderBottom: `${vars.sizes.$0} solid ${vars.colors.$neutral2}`,
    selectors: {
      [`${darkThemeClass} &`]: {
        borderBottom: `${vars.sizes.$0} solid ${vars.colors.$neutral3}`,
      },
    },
  },
]);

export const tabClass = style([
  sprinkles({
    border: 'none',
    cursor: 'pointer',
    paddingY: '$2',
    fontSize: '$md',
    backgroundColor: 'transparent',
    color: '$neutral4',
  }),
  {
    whiteSpace: 'nowrap',
  },
]);

export const selectedClass = style([
  sprinkles({
    fontWeight: '$bold',
  }),
  {
    color: vars.colors.$primaryContrast,
  },
]);

export const selectorLine = style([
  sprinkles({
    position: 'absolute',
    display: 'block',
    backgroundColor: {
      darkMode: '$neutral6',
      lightMode: '$primaryAccent',
    },
    width: 0,
    height: '$0',
  }),
  {
    bottom: '-2px', // for some reason a negative cant be done with vars
    transition: 'transform .4s ease, width .4s ease',
    transform: `translateX(0)`,
  },
]);

export const tabsContainerWrapper = style([
  sprinkles({
    display: 'flex',
    width: '100%',
  }),
  {
    overflowY: 'scroll',
  },
]);
