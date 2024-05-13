import '@kadena/react-ui/global';
import { style } from '@vanilla-extract/css';

export const stickyHeader = style({
  position: 'fixed', 
  top: 0,            
  width: '100%',     
  zIndex: 1000, 
});
