import { tokens } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const pluginContainerClass = style({
  borderRadius: '5px',
  border: '1px solid #ccc',
  overflow: 'hidden',
});

export const pluginIconClass = style({
  height: '36px',
  width: '36px',
  borderRadius: '4px',
  fontSize: '18px',
  backgroundColor: tokens.kda.foundation.color.neutral.n100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  textDecoration: 'none',
  fontWeight: 'bold',
});
