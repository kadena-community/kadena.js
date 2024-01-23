import { createVar, fallbackVar, style } from '@vanilla-extract/css';
import { atoms, token } from '../../styles';

export type FormFieldStatus = 'disabled' | 'positive' | 'warning' | 'negative';
export const statusColor = createVar();
export const statusOutlineColor = createVar();

export const baseOutlinedClass = style([
  {
    outline: `2px solid ${fallbackVar(
      statusOutlineColor,
      token('color.border.base.default'),
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
    boxShadow: `0px 1px 0 0 ${token('color.border.base.default')}`,
    outlineOffset: '2px',
    selectors: {
      '&:focus-within': {
        outline: `2px solid ${fallbackVar(
          statusColor,
          token('color.border.semantic.info.@focus'),
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

export const inputContainer = atoms({
  display: 'flex',
  flex: 1,
  position: 'relative',
  alignItems: 'stretch',
});
