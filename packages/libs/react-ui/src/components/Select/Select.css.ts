import { vars } from '../../styles';

import { sprinkles } from '@theme/sprinkles.css';
import { style, styleVariants } from '@vanilla-extract/css';

export const containerClass = style([
  sprinkles({
    alignItems: 'stretch',
    display: 'flex',
    overflow: 'hidden',
    lineHeight: '$lg',
    borderRadius: '$sm',
    flexDirection: 'column',
    backgroundColor: {
      lightMode: '$white',
      darkMode: '$gray100',
    },
    color: '$foreground',
    borderColor: {
      lightMode: '$white',
      darkMode: '$gray60',
    },
  }),
  {
    position: 'relative',
  },
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
  default: [
    {
      borderBottom: `1px solid ${vars.colors.$gray30}`,
    },
  ],
  solid: [
    {
      border: `1px solid ${vars.colors.$gray30}`,
    },
  ],
});

export const selectContainerClass = style([
  sprinkles({
    alignItems: 'center',
    lineHeight: '$lg',
    flexGrow: 1,
    display: 'flex',
    paddingRight: '$2',
    paddingLeft: '$4',
    gap: '$2',
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
