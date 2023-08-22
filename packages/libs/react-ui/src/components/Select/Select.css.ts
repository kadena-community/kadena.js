import { vars } from '../../styles';

import { sprinkles } from '@theme/sprinkles.css';
import { style } from '@vanilla-extract/css';

export const containerClass = style([
  sprinkles({
    backgroundColor: '$neutral1',
    color: '$neutral5',
    padding: '$2',
    borderRadius: '$sm',
  }),
  {
    boxShadow: `0 1px 1px 0 ${vars.colors.$gray30}`,
    position: 'relative',
  },
]);
export const containerClassDisabled = style([
  sprinkles({ pointerEvents: 'none' }),
  { opacity: 0.5 },
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
