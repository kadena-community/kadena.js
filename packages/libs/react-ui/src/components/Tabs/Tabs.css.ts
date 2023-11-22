import { sprinkles } from '@theme/sprinkles.css';
import { vars } from '@theme/vars.css';
import { style } from '@vanilla-extract/css';

export const tabsContainerClass = style([
  sprinkles({
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
  }),
]);

export const tabListClass = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
  }),
  {
    borderBottom: `${vars.sizes.$0} solid ${vars.colors.$neutral2}`,
  },
]);

export const tabItemClass = style([
  sprinkles({
    border: 'none',
    cursor: 'pointer',
    paddingY: '$1',
    marginRight: '$4',
    fontSize: '$md',
    fontWeight: '$semiBold',
    backgroundColor: 'transparent',
    color: '$neutral4',
  }),
  {
    opacity: '.6',
    whiteSpace: 'nowrap',
    selectors: {
      '&[data-selected="true"]': {
        opacity: '1',
        color: vars.colors.$primaryContrastInverted,
      },
    },
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
    bottom: '-2px',
    transition: 'transform .4s ease, width .4s ease',
    transform: `translateX(0)`,
  },
]);

export const tabContentClass = style([
  sprinkles({
    marginY: '$2',
    fontSize: '$base',
    color: '$neutral4',
  }),
]);
