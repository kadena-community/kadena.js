import { sprinkles, vars } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

// Start of copied styles from @kadena/react-ui Tag component
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
// End of copied styles from @kadena/react-ui Tag component

export const tagStyles = style([
  tagLabelClass,
  sprinkles({
    fontFamily: '$mono',
  }),
]);

export const tooltipStyles = style([sprinkles({ fontFamily: '$mono' })]);
