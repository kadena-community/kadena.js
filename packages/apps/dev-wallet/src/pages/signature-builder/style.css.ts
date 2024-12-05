import { tokens } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const codeArea = style({
  width: `100%`,
  minHeight: '300px',
  background: tokens.kda.foundation.color.background.surface.default,
  color: tokens.kda.foundation.color.text.base.default,
  padding: '10px',
  fontSize: '14px',
  border: `1px solid ${tokens.kda.foundation.color.border.base.default}`,
  margin: '0',
  resize: 'none',
  fontFamily: tokens.kda.foundation.typography.family.monospaceFont,
});
