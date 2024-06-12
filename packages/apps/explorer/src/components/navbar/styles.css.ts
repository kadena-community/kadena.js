import { globalStyle, style } from '@vanilla-extract/css';
import { $$pageWidth } from '../layout/styles.css';

export const navbarWrapperClass = style({});

globalStyle(`${navbarWrapperClass} > nav >div`, {
  maxWidth: $$pageWidth,
});
