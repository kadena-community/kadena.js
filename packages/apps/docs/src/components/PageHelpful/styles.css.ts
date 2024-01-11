import { darkThemeClass, sprinkles, vars } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const textAreaClass = style([
  sprinkles({
    alignItems: 'center',
    background: 'none',
    border: 'none',
    outline: 'none',
    flexGrow: 1,
    color: '$foreground',
    borderRadius: '$sm',
  }),
  {
    paddingBlock: vars.sizes.$2,
    paddingInline: vars.sizes.$2,
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
    marginBlockStart: `calc(${vars.sizes.$16} * -1)`,
    paddingInlineEnd: vars.sizes.$10,
  },
]);
