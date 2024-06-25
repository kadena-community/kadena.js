import { cardColor } from '@/utils/color';
import { atoms, tokens } from '@kadena/react-ui/styles';
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
    fontFamily: 'secondaryFont',
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
