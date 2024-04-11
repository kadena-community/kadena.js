import { deviceColors } from '@/styles/tokens.css';
import { atoms, tokens } from '@kadena/react-ui/styles';
import { globalStyle, style } from '@vanilla-extract/css';

export const wrapperClass = style([
  atoms({
    display: 'flex',
    width: '100%',
    padding: 'no',
    margin: 'no',
  }),
  {
    flexWrap: 'wrap',
    listStyle: 'none',
  },
]);
export const multipleWrapperClass = style([
  atoms({
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 'md',
  }),
  {
    flexWrap: 'nowrap',
    border: '1px solid rgba(255,255,255,.2)',
  },
]);
export const readytoMintClass = style([
  {
    color: deviceColors.green,
  },
]);
export const notReadytoMintClass = style([
  {
    opacity: 0.8,
  },
]);

export const multipleSigneeClass = style([
  atoms({
    display: 'flex',
    width: '100%',
    padding: 'md',
    gap: 'sm',
    alignItems: 'center',
  }),
]);

export const signeeClass = style([
  atoms({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'md',
    padding: 'md',
  }),
  {
    flex: '1 1 50%',
    width: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    selectors: {
      '&:first-child': {
        borderRadius: tokens.kda.foundation.radius.md,
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

export const multipleNameClass = style([
  {
    textAlign: 'initial',
  },
]);
export const notAllowedToSignClass = style([
  {
    opacity: '.2',
  },
]);

export const ellipsClass = style([
  {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
]);

export const removeClass = style([
  atoms({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 'md',
  }),
  {
    height: '100%',
    backgroundColor: deviceColors.red,
    userSelect: 'none',
  },
]);

export const removeSigningClass = style([
  atoms({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 'md',
  }),
  {
    height: '100%',
    backgroundColor: deviceColors.blue,
    userSelect: 'none',
  },
]);

globalStyle(`${multipleWrapperClass} > :nth-child(even)`, {
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
});
globalStyle(`${multipleWrapperClass} > :nth-child(odd)`, {
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
});
globalStyle(`${multipleWrapperClass} > :not(:last-child)`, {
  borderBlockEnd: '1px solid rgba(255,255,255,.2)',
});
globalStyle(`${multipleWrapperClass} > :first-child`, {
  borderTopLeftRadius: tokens.kda.foundation.radius.md,
  borderTopRightRadius: tokens.kda.foundation.radius.md,
});
globalStyle(`${multipleWrapperClass} > :last-child`, {
  borderBottomLeftRadius: tokens.kda.foundation.radius.md,
  borderBottomRightRadius: tokens.kda.foundation.radius.md,
});
