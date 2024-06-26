import { tokens } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const accountNameTextClass = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontWeight: tokens.kda.foundation.typography.weight.primaryFont.medium,
  color: tokens.kda.foundation.color.text.base.default,
});
