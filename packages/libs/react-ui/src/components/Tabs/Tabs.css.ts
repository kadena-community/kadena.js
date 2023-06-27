import { sprinkles, vars } from '../../styles';

import { style } from '@vanilla-extract/css';

export const tabsContainer = style([
  sprinkles({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  }),
  {
    borderBottom: `${vars.sizes.$1} solid ${vars.colors.$neutral2}`,
    marginBottom: vars.sizes.$4,
  },
]);

export const tabClass = style([
  sprinkles({
    border: 'none',
    cursor: 'pointer',
    paddingY: '$2',
    fontSize: '$md',
  }),
  {
    backgroundColor: 'transparent',
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
  }),
  {
    bottom: '-4px', // for some reason a negative cant be done with vars
    transition: 'all .4s ease',
    transform: `translateX(0)`,
    width: '0',
    height: vars.sizes.$1,
  },
]);
