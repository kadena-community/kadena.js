import { sprinkles, vars } from '../../styles';

import {
  helperIconColor,
  helperTextColor,
} from './InputHelper/InputHelper.css';

import { createVar, styleVariants } from '@vanilla-extract/css';

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
