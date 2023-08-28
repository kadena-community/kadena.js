import { vars } from '../../styles';

import { sprinkles } from '@theme/sprinkles.css';
import { style, styleVariants } from '@vanilla-extract/css';

export const containerClass = style([
  sprinkles({
    alignItems: 'stretch',
    color: '$foreground',
    display: 'flex',
    overflow: 'hidden',
    lineHeight: '$lg',
    borderRadius: '$sm',
    borderColor: {
      lightMode: '$white',
      darkMode: '$gray60',
    },
  }),
]);

export const containerClassDisabled = style([
  sprinkles({
    backgroundColor: {
      lightMode: '$gray20',
    },
    color: {
      lightMode: '$foreground',
    },
  }),
]);

export const selectVariants = styleVariants({
  form: [
    sprinkles({
      backgroundColor: {
        lightMode: '$white',
        darkMode: '$background',
      },
    }),
    {
      borderBottom: `1px solid ${vars.colors.$gray30}`,
    },
  ],
  transparent: [
    sprinkles({
      backgroundColor: 'transparent',
      borderRadius: '$xs',
    }),
    {
      border: `1px solid ${vars.colors.$gray40}`,
    },
  ],
});

export const selectContainerClass = style([
  sprinkles({
    alignItems: 'center',
    display: 'flex',
    flexGrow: 1,
    gap: '$2',
    lineHeight: '$lg',
    paddingLeft: '$4',
    paddingRight: '$2',
  }),
]);

export const iconClass = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
  }),
]);

export const selectClass = style([
  sprinkles({
    background: 'none',
    border: 'none',
    color: '$foreground',
    outline: 'none',
    paddingRight: '$2',
    paddingY: '$2',
    flexGrow: 1,
  }),
  {
    backgroundColor: 'inherit',
    color: 'inherit',
  },
]);
