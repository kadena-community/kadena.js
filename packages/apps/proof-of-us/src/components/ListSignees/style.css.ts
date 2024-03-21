import { atoms, tokens } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const wrapperClass = style([
  atoms({
    display: 'flex',
    width: '100%',
    padding: 'no',
  }),
  {
    listStyle: 'none',
  },
]);

export const signeeClass = style([
  atoms({
    padding: 'md',
  }),
  {
    flex: '1 1 50%',
    width: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    selectors: {
      '&:first-child': {
        borderTopLeftRadius: tokens.kda.foundation.radius.md,
        borderBottomLeftRadius: tokens.kda.foundation.radius.md,
        border: '1px solid rgba(255,255,255,.2)',
        borderInlineEnd: '0',
      },
      '&:last-child': {
        borderTopRightRadius: tokens.kda.foundation.radius.md,
        borderBottomRightRadius: tokens.kda.foundation.radius.md,
        border: '1px solid rgba(255,255,255,.2)',
      },
    },
  },
]);

export const accountClass = style([
  {
    fontFamily: 'Kode Mono',
    width: '50%',
    textAlign: 'center',
    opacity: '.6',
  },
]);
export const nameClass = style([
  {
    fontFamily: 'Kode Mono',
    textTransform: 'capitalize',
    width: '50%',
    textAlign: 'center',
  },
]);

export const ellipsClass = style([
  {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
]);
