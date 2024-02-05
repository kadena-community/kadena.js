import { style } from '@vanilla-extract/css';
import { sprinkles } from '../../styles/sprinkles.css';
import { darkThemeClass, vars } from '../../styles/vars.css';

export const tdClass = style([
  sprinkles({
    paddingY: '$3',
    paddingX: '$4',
    color: '$neutral5',
  }),
  {
    verticalAlign: 'top',
  },
]);

export const trClass = style([
  sprinkles({
    backgroundColor: '$neutral1',
    height: '$12',
  }),
  {
    selectors: {
      '.stripedClass &:nth-child(even)': {
        background: vars.colors.$neutral2,
      },
      '.stripedClass &:hover': {
        background: vars.colors.$blue10,
      },
      [`${darkThemeClass} .stripedClass &:hover`]: {
        background: vars.colors.$blue100,
      },
    },
  },
]);

export const linkButtonClass = style([
  sprinkles({
    marginRight: '$2',
  }),
  {
    float: 'right',
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
  }),
]);

export const tableClass = style([
  sprinkles({
    backgroundColor: '$neutral2',
    width: '100%',
    borderRadius: '$sm',
    overflow: 'hidden',
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
