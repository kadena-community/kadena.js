import { vars } from '../../styles';

import { sprinkles } from '@theme/sprinkles.css';
import { style } from '@vanilla-extract/css';

export const containerClass = style([
  sprinkles({
    padding: '$2',
    borderRadius: '$sm',
  }),
  {
    position: 'relative',
  },
]);

export const containerClassForm = style([
  sprinkles({
    backgroundColor: '$white',
  }),
  {
    boxShadow: `0 1px 1px 0 ${vars.colors.$gray30}`,
  },
]);

export const containerClassFormDisabled = style([
  sprinkles({
    backgroundColor: '$gray20',
  }),
  {
    boxShadow: 'none',
  },
]);

export const containerClassDefault = style([
  sprinkles({
    backgroundColor: '$black',
    color: '$gray40',
  }),
  {
    border: `1px solid ${vars.colors.$gray60}`,
    ':disabled': {
      pointerEvents: 'none',
      backgroundColor: vars.colors.$gray20,
    },
  },
]);

export const selectContainerClass = style([
  sprinkles({
    display: 'flex',
  }),
]);

export const iconClass = style([
  sprinkles({
    marginRight: '$2',
    marginLeft: '$2',
    display: 'block',
  }),
]);

export const selectClass = style([
  sprinkles({
    border: 'none',
    fontSize: '$base',
  }),
  {
    padding: '0',
    backgroundColor: 'inherit',
    color: 'inherit',
    flex: '1',
  },
]);

export const optionClass = style([
  sprinkles({
    backgroundColor: '$neutral1',
    color: '$neutral5',
  }),
]);
