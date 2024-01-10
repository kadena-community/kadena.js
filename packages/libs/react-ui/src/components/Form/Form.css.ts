import { createVar, fallbackVar, style } from '@vanilla-extract/css';
import { atoms } from '../../styles/atoms.css';
import { tokens } from '../../styles/tokens/contract.css';

export type FormFieldStatus = 'disabled' | 'positive' | 'warning' | 'negative';
export const statusColor = createVar();
export const statusOutlineColor = createVar();

export const baseOutlinedClass = style([
  {
    outline: `2px solid ${fallbackVar(
      statusOutlineColor,
      tokens.kda.foundation.color.border.base.default,
    )}`,
  },
]);

export const baseContainerClass = style([
  atoms({
    alignItems: 'stretch',
    borderRadius: 'sm',
    display: 'flex',
    color: 'text.base.default',
    overflow: 'hidden',
    lineHeight: 'lg',
    backgroundColor: 'layer-3.default',
    position: 'relative',
  }),
  {
    boxShadow: `0px 1px 0 0 ${tokens.kda.foundation.color.border.base.default}`,
    outlineOffset: '2px',
    selectors: {
      '&:focus-within': {
        outline: `2px solid ${fallbackVar(
          statusColor,
          tokens.kda.foundation.color.border.semantic.info['@focus'],
        )}`,
        outlineOffset: '2px',
      },
    },
  },
]);

export const formField = atoms({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  gap: 'sm',
});

export const inputContainer = style([
  atoms({
    display: 'flex',
    flex: 1,
    position: 'relative',
    alignItems: 'stretch',
  }),
]);
