import { globalStyle, style } from '@vanilla-extract/css';

export const compactTableClass = style({});

globalStyle(
  `${compactTableClass} td, ${compactTableClass} th, ${compactTableClass} tr`,
  {
    padding: '4px 8px',
  },
);

globalStyle(`${compactTableClass} tr`, {
  height: '100%',
});

globalStyle(`${compactTableClass} a`, {
  padding: '0',
});
