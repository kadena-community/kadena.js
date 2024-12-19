import { globalStyle, style } from '@vanilla-extract/css';
import { atoms, recipe } from './../../../styles';

export const tableClass = style({
  width: '100%',
});

globalStyle(`${tableClass} td > span`, {
  display: 'block',
  alignItems: 'center',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

globalStyle(`${tableClass} td > span:not(:has(button))`, {
  contain: 'inline-size',
});

export const tableBorderClass = recipe({
  base: {},
  variants: {
    variant: {
      default: [
        atoms({
          padding: 'sm',
          borderRadius: 'lg',
          borderColor: 'base.subtle',
          borderWidth: 'hairline',
          borderStyle: 'solid',
        }),
      ],
      open: {},
    },
  },
});
