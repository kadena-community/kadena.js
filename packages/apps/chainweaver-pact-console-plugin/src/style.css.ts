import '@kadena/kode-ui/global';
import { tokens } from '@kadena/kode-ui/styles';
import { globalStyle, style } from '@vanilla-extract/css';

globalStyle('body', {
  padding: 10,
  backgroundColor: tokens.kda.foundation.color.neutral.n1,
});

export const inputClass = style({
  width: '100%',
  border: 'none',
  fontFamily: tokens.kda.foundation.typography.family.monospaceFont,
  fontSize: 14,
  backgroundColor: tokens.kda.foundation.color.neutral.n1,
  color: tokens.kda.foundation.color.neutral.n90,
  caretShape: 'block',
});

export const badgeClass = style({
  backgroundColor: tokens.kda.foundation.color.neutral.n100,
  color: tokens.kda.foundation.color.neutral.n1,
  fontWeight: 'normal',
  border: 'none',
  borderRadius: '2px',
  fontSize: '12px',
  lineHeight: '16px',
  height: '18px',
  display: 'flex',
  alignItems: 'center',
  selectors: {
    '&.network': {
      width: '90px',
    },
    '&.chain': {
      width: '40px',
    },
    '&.disabled': {
      opacity: 0.6,
    },
  },
});

export const commandOutput = style({
  fontFamily: tokens.kda.foundation.typography.family.monospaceFont,
});
