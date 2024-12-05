import { vars } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const tabStyle = style({
  padding: 0,
  paddingBottom: '2px',
  backgroundColor: 'transparent',
  border: 'none',
  color: vars.colors.$borderContrast,
  borderBottom: 'solid 2px transparent',
  cursor: 'pointer',
  selectors: {
    '&.selected': {
      borderBottomColor: vars.colors.$foreground,
      color: vars.colors.$foreground,
    },
  },
});
