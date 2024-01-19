import { createVar, fallbackVar, style } from '@vanilla-extract/css';
import { atoms } from '../../../../styles/atoms.css';
import { tokens } from '../../../../styles/tokens/contract.css';

export const helperIconColor = createVar(),
  helperTextColor = createVar();

export const helperClass = style([
  atoms({
    display: 'flex',
    alignItems: 'center',
    gap: 'xxs',
    fontSize: 'xs',
    marginBlock: 'sm',
  }),
  {
    color: fallbackVar(
      helperTextColor,
      tokens.kda.foundation.color.text.semantic.info.default,
    ),
  },
]);

export const helperIconClass = style({
  color: fallbackVar(
    helperIconColor,
    tokens.kda.foundation.color.icon.semantic.info.default,
  ),
});
