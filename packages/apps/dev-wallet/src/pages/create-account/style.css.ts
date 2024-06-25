import { cardColor } from '@/utils/color';
import { atoms, tokens } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const keyInput = style({
  maxWidth: '100%',
  flex: 1,
  color: 'white',
  textAlign: 'left',
});

export const advanceOptions = style({
  backgroundColor: 'transparent',
  color: tokens.kda.foundation.color.palette.aqua.n50,
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
    width: '100%',
  }),
  {
    cursor: 'pointer',
    backgroundColor: cardColor,
    border: `1px solid ${cardColor}`,
  },
]);

export const selectedClass = style([cardClass, { backgroundColor: '#478842' }]);
