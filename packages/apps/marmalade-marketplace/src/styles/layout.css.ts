import '@kadena/kode-ui/global';
import { style } from '@vanilla-extract/css';

export const stickyHeader = style({
  position: 'fixed',
  top: 0,
  width: '90%',
  left: '5%',
  zIndex: 1000,
});

export const mainContainer = style({
  margin: '120px 5% 0'
});
