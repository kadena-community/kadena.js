import { sprinkles } from '@theme/sprinkles.css';
import { vars } from '@theme/vars.css';

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
    borderBottom: `${vars.sizes.$1} solid ${vars.colors.$neutral2}`,
  },
]);

export const tabClass = style([
  sprinkles({
    border: 'none',
    cursor: 'pointer',
    paddingY: '$2',
    fontSize: '$md',
    backgroundColor: 'transparent',
    color: '$foreground',
  }),
  {
    whiteSpace: 'nowrap',
  },
]);

export const selectedClass = style([
  sprinkles({
    color: '$primaryContrast',
    fontWeight: '$bold',
  }),
]);

export const selectorLine = style([
  sprinkles({
    position: 'absolute',
    display: 'block',
    backgroundColor: '$primaryAccent',
    width: 0,
    height: '$1',
  }),
  {
    bottom: '-4px', // for some reason a negative cant be done with vars
    transition: 'all .4s ease',
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
