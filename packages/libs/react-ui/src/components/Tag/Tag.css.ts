import { sprinkles } from '@theme/sprinkles.css';
import { vars } from '@theme/vars.css';
import { style } from '@vanilla-extract/css';

export const tagClass = style([
  sprinkles({
    backgroundColor: '$neutral1',
    color: '$neutral6',
    borderRadius: '$xs',
    padding: '$1',
    display: 'inline-flex',
    alignItems: 'center',
  }),
  {
    border: `1px solid ${vars.colors.$borderSubtle}`,
  },
]);

export const tagLabelClass = style([
  sprinkles({
    paddingX: '$2',
  }),
]);

export const closeButtonClass = style([
  sprinkles({
    border: 'none',
    background: 'none',
    padding: '$1',
    cursor: 'pointer',
  }),
]);
