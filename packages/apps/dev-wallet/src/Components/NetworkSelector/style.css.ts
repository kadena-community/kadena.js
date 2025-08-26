import { style } from '@kadena/kode-ui';
import { globalStyle } from '@kadena/kode-ui/styles';

export const truncateClass = style({});

globalStyle(`${truncateClass} > span`, {
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  maxWidth: '150px',
});
