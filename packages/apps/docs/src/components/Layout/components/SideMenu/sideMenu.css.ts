import { responsiveStyle, sprinkles, vars } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const sideMenuClass = style([
  sprinkles({
    position: 'relative',
  }),
  {
    height: `calc(100vh - ${vars.sizes.$18})`,
    overflowY: 'auto',
    overflowX: 'hidden',
    ...responsiveStyle({
      md: {
        height: `calc(100vh - ${vars.sizes.$48})`,
      },
    }),
  },
]);

export const listClass = style([
  sprinkles({
    padding: 0,
  }),
  {
    listStyle: 'none',
  },
]);

export const listItemClass = style([
  {
    paddingBlockStart: vars.sizes.$4,
    paddingBlockEnd: vars.sizes.$2,
    borderBottom: `1px solid ${vars.colors.$borderDefault}`,
  },
]);

export const sideMenuTitleClass = style([
  sprinkles({
    display: 'block',
    padding: 0,
    textAlign: 'left',
    fontSize: '$sm',
    backgroundColor: 'transparent',
    border: 'none',
  }),
  {
    paddingInlineStart: vars.sizes.$4,
    marginBlock: vars.sizes.$4,
  },
]);

export const sideMenuTitleButtonClass = style([
  sprinkles({
    display: {
      sm: 'flex',
      md: 'none',
    },
    textAlign: 'left',
    cursor: 'pointer',
  }),
  {
    paddingInlineStart: vars.sizes.$9,
    border: '0',
    backgroundColor: 'transparent',

    selectors: {
      '&:hover::before': {
        transform: `translate(0, ${vars.sizes.$2}) rotate(45deg)`,
      },
      '&::before': {
        position: 'absolute',
        left: vars.sizes.$3,
        content: '',
        width: vars.sizes.$2,
        height: vars.sizes.$2,
        borderLeft: `2px solid ${vars.colors.$foreground}`,
        borderBottom: `2px solid ${vars.colors.$foreground}`,
        transform: `translate(${vars.sizes.$2}, ${vars.sizes.$2}) rotate(45deg)`,
        transition: 'transform .2s ease ',
      },
    },
  },
]);
