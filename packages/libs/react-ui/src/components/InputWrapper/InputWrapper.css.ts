import {
  helperIconColor,
  helperTextColor,
} from './InputHelper/InputHelper.css';

import { sprinkles } from '@theme/sprinkles.css';
import { darkThemeClass, vars } from '@theme/vars.css';
import {
  createVar,
  fallbackVar,
  style,
  styleVariants,
} from '@vanilla-extract/css';

export const statusColor = createVar();

export type Status = 'disabled' | 'positive' | 'warning' | 'negative';

const statusOptions: Record<Status, Status> = {
  disabled: 'disabled',
  positive: 'positive',
  warning: 'warning',
  negative: 'negative',
};

export const statusVariant = styleVariants(statusOptions, (status) => {
  if (status === 'disabled') {
    return [sprinkles({ pointerEvents: 'none' }), { opacity: 0.4 }];
  }

  return {
    vars: {
      [helperIconColor]: vars.colors[`$${status}Accent`],
      [statusColor]: vars.colors[`$${status}Accent`],
      [helperTextColor]: vars.colors[`$${status}ContrastInverted`],
    },
  };
});

export const containerClass = style([
  sprinkles({
    borderRadius: '$sm',
    display: 'flex',
  }),
  {
    border: `1px solid ${fallbackVar(statusColor, vars.colors.$gray30)}`,
    selectors: {
      [`${darkThemeClass} &`]: {
        border: `1px solid ${fallbackVar(statusColor, vars.colors.$gray60)}`,
      },
    },
  },
]);
