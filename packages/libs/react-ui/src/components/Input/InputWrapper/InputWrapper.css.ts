import { vars } from '../../../styles';

import { sprinkles } from './../../../styles/sprinkles.css';

import { createVar, styleVariants } from '@vanilla-extract/css';

export const helperIconColor = createVar(),
  statusColor = createVar();

export const statusVariant = styleVariants({
  disabled: [sprinkles({ pointerEvents: 'none' }), { opacity: 0.5 }],
  error: {
    vars: {
      [helperIconColor]: vars.colors.$negativeAccent,
      [statusColor]: vars.colors.$negativeAccent,
    },
  },
  success: {
    vars: {
      [helperIconColor]: vars.colors.$positiveAccent,
      [statusColor]: vars.colors.$positiveAccent,
    },
  },
});
