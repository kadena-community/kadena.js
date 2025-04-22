import { tokens } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const pluginContainerClass = style({
  borderRadius: '5px',
  border: '1px solid #ccc',
  overflow: 'hidden',
  padding: '1px',
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
  color: tokens.kda.foundation.color.neutral.n1,
  textDecoration: 'none',
  fontWeight: 'bold',
});

export const smallPluginIconClass = style({
  height: '12px',
  width: '12px',
  borderRadius: '2px',
  fontSize: '6px',
  backgroundColor: tokens.kda.foundation.color.neutral.n100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: tokens.kda.foundation.color.neutral.n1,
  textDecoration: 'none',
  fontWeight: 'bold',
});
