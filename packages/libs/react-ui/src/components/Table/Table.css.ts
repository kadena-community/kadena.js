import { sprinkles } from '@theme/sprinkles.css';
import { darkThemeClass, vars } from '@theme/vars.css';
import { style } from '@vanilla-extract/css';

export const tdClass = style([
  sprinkles({
    paddingY: '$3',
    paddingX: '$4',
    color: '$neutral5',
  }),
]);

export const trClass = style([
  sprinkles({
    backgroundColor: '$neutral1',
    height: '$10',
  }),
  {
    selectors: {
      [`.stripedClass &:nth-child(even)`]: {
        background: vars.colors.$neutral2,
      },
      [`.stripedClass &:hover`]: {
        background: vars.colors.$primarySurface,
      },
    },
  },
]);

export const thClass = style([
  sprinkles({
    paddingY: '$3',
    paddingX: '$4',
    backgroundColor: {
      lightMode: '$gray30',
      darkMode: '$gray80',
    },
    color: '$neutral6',
    textAlign: 'left',
    wordBreak: 'break-all',
  }),
]);

export const tableClass = style([
  sprinkles({
    backgroundColor: '$neutral2',
    width: '100%',
    borderRadius: '$sm',
    overflow: 'hidden',
    wordBreak: 'break-all',
  }),
  {
    border: `1px solid ${vars.colors.$gray30}`,
    borderSpacing: 0,
    selectors: {
      [`${darkThemeClass} &`]: {
        border: `1px solid ${vars.colors.$gray60}`,
      },
    },
  },
]);
