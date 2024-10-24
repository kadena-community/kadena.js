import { cardColor, cardHoverColor } from '@/utils/color';
import { atoms, tokens } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const keyInput = style({
  maxWidth: '100%',
  width: '100%',
  flex: 1,
  color: 'white',
  textAlign: 'left',
});

export const advanceOptions = style({
  backgroundColor: 'transparent',
  color: tokens.kda.foundation.color.palette.aqua.n50,
  fontSize: tokens.kda.foundation.typography.fontSize.md,
  border: 'none',
  textAlign: 'left',
  cursor: 'pointer',
  padding: '0',
});

export const cardClass = style([
  atoms({
    borderRadius: 'xs',
    padding: 'md',
    textAlign: 'center',
    fontFamily: 'primaryFont',
  }),
  {
    cursor: 'pointer',
    backgroundColor: cardColor,
    border: `1px solid ${cardColor}`,
  },
]);

export const passwordDialog = style([
  {
    padding: '30px',
    border: 'none',
    maxWidth: '460px',
  },
]);

export const selectedClass = style([cardClass, { backgroundColor: '#478842' }]);

export const buttonListClass = style([
  atoms({
    padding: 'sm',
    paddingInline: 'md',
    marginBlockStart: 'xs',
    textDecoration: 'none',
  }),
  {
    border: 'solid 1px transparent',
    cursor: 'pointer',
    flex: 1,
    minHeight: '50px',
    background: tokens.kda.foundation.color.background.surface.default,
    selectors: {
      '&:hover': {
        background: cardHoverColor,
      },
      '&:disabled': {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
      '&.selected': {
        background: cardHoverColor,
        border: `1px solid ${tokens.kda.foundation.color.border.base['@active']}`,
      },
    },
  },
]);
