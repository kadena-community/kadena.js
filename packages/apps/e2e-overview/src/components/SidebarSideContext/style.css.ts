import { globalStyle } from '@vanilla-extract/css';

globalStyle(`[data-isexpanded="false"] > section[data-fullwidth="true"]`, {
  flexDirection: 'column',
  alignItems: 'center',
});

globalStyle(`[data-isexpanded="true"] > section[data-fullwidth="true"]`, {
  flex: 1,
});
