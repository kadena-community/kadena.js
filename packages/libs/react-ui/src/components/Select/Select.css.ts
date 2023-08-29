import { vars } from '../../styles';

import { sprinkles } from '@theme/sprinkles.css';
import { style } from '@vanilla-extract/css';

export const containerClass = style([
  sprinkles({
    alignItems: 'stretch',
    backgroundColor: {
      lightMode: '$white',
      darkMode: '$background',
    },
    borderColor: {
      lightMode: '$white',
      darkMode: '$gray60',
    },
    borderRadius: '$sm',
    color: '$foreground',
    display: 'flex',
    lineHeight: '$lg',
    overflow: 'hidden',
  }),
  {
    borderBottom: `1px solid ${vars.colors.$gray30}`,
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
    alignItems: 'center',
    display: 'flex',
  }),
]);

export const selectClass = style([
  sprinkles({
    background: 'none',
    border: 'none',
    color: '$foreground',
    flexGrow: 1,
    outline: 'none',
    paddingRight: '$2',
    paddingY: '$2',
  }),
  {
    backgroundColor: 'inherit',
    color: 'inherit',
  },
]);
