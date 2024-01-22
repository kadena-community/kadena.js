import { styleVariants } from '@vanilla-extract/css';
import { atoms } from '../../../styles/atoms.css';
import { tokens } from '../../../styles/tokens/contract.css';
import { statusColor, statusOutlineColor } from '../Form.css';
import {
  helperIconColor,
  helperTextColor,
} from './FormFieldHelper/FormFieldHelper.css';

const statusOptions = {
  disabled: 'disabled',
  positive: 'positive',
  warning: 'warning',
  negative: 'negative',
} as const;

export const statusVariant = styleVariants(statusOptions, (status) => {
  if (status === 'disabled') {
    return [atoms({ pointerEvents: 'none' }), { opacity: 0.4 }];
  }

  return {
    vars: {
      [helperIconColor]:
        tokens.kda.foundation.color.icon.semantic[status]?.default,
      [statusColor]:
        tokens.kda.foundation.color.border.semantic[status]?.['@focus'],
      [statusOutlineColor]:
        tokens.kda.foundation.color.border.semantic[status]?.subtle,
      [helperTextColor]:
        tokens.kda.foundation.color.text.semantic[status]?.default,
    },
  };
});
