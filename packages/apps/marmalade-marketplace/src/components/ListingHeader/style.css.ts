import { style, globalStyle } from '@vanilla-extract/css';

export const listingHeader = style({
  marginTop: '-60px',
  marginLeft: '-6%',
  marginRight: '-6%',
});

globalStyle(`${listingHeader} svg`, {
  width: '100%',
  height: '100%',
  objectFit: 'cover',  
  maxHeight: '501px',
});
  
export const listingImage = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',  
  maxHeight: '501px',
});
  