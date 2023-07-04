import { vars } from '../../styles';
import { sprinkles } from '../../styles/sprinkles.css';
import { inputStatusColor } from '../Input/Input.css';

import {
  helperIconColor,
  helperTextColor,
} from './InputHelper/InputHelper.css';

import { styleVariants } from '@vanilla-extract/css';

export type Status = 'disabled' | 'positive' | 'warning' | 'negative';

const statusOptions: Record<Status, Status> = {
  disabled: 'disabled',
  positive: 'positive',
  warning: 'warning',
  negative: 'negative',
};

export const statusVariant = styleVariants(statusOptions, (status) => {
  if (status === 'disabled') {
    return [sprinkles({ pointerEvents: 'none' }), { opacity: 0.5 }];
  }

  return {
    vars: {
      [helperIconColor]: vars.colors[`$${status}Accent`],
      [inputStatusColor]: vars.colors[`$${status}Accent`],
      [helperTextColor]: vars.colors[`$${status}Contrast`],
    },
  };
});
