import { sprinkles } from '@theme/sprinkles.css';
import { vars } from '@theme/vars.css';
import { styleVariants } from '@vanilla-extract/css';
import type { FormFieldStatus } from '../Form.css';
import { statusColor, statusOutlineColor } from '../Form.css';
import {
  helperIconColor,
  helperTextColor,
} from './FormFieldHelper/FormFieldHelper.css';

const statusOptions: Record<FormFieldStatus, FormFieldStatus> = {
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
      // TODO update the color to match the new design system tokens
      [statusOutlineColor]: vars.colors[`$${status}Surface`],
      [helperTextColor]: vars.colors[`$${status}ContrastInverted`],
    },
  };
});
