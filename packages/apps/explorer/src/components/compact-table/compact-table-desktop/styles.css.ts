import { atoms } from '@kadena/kode-ui/styles';
import { globalStyle, style } from '@vanilla-extract/css';

export const tableClass = style({
  width: '100%',
});

globalStyle(`${tableClass} td span`, {
  display: 'block',
  alignItems: 'center',
  contain: 'inline-size',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const tableBorderClass = style([
  atoms({
    borderRadius: 'lg',
    borderColor: 'base.subtle',
    borderWidth: 'hairline',
    borderStyle: 'solid',
  }),
  {},
]);
