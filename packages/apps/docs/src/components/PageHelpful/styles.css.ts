import { darkThemeClass, sprinkles, vars } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const textAreaClass = style([
  sprinkles({
    alignItems: 'center',
    background: 'none',
    border: 'none',
    outline: 'none',
    flexGrow: 1,
    paddingY: '$2',
    paddingX: '$2',
    color: '$foreground',
    borderRadius: '$sm',
  }),
  {
    border: `1px solid ${vars.colors.$neutral3}`,
    resize: 'none',
    width: '100%',
    height: '100px',
  },
  {
    '::placeholder': {
      color: vars.colors.$gray40,
    },
    [`${darkThemeClass} &::placeholder`]: {
      color: vars.colors.$gray50,
    },
  },
]);

export const modalWrapperClass = style([
  {
    marginTop: `calc(${vars.sizes.$16} * -1)`,
    paddingRight: vars.sizes.$10,
  },
]);
