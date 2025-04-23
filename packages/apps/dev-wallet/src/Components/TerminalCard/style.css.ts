import { style } from '@kadena/kode-ui';
import { globalStyle, token } from '@kadena/kode-ui/styles';

export const terminalWrapperClass = style([
  {
    backgroundColor: 'black!important',
  },
]);

globalStyle(`${terminalWrapperClass} pre`, {
  color: 'white',
  wordBreak: 'break-all',
});

globalStyle(`${terminalWrapperClass} [role="tablist"]`, {
  display: 'flex',
  gap: token('spacing.xs'),
});

globalStyle(`${terminalWrapperClass} [class^="Tabs"]:before`, {
  border: 0,
  background: 'green!important',
});

globalStyle(`${terminalWrapperClass} [data-selected][role="tab"]`, {
  backgroundColor: 'transparent',
  color: 'white',
  borderRadius: 0,
  border: '1px solid white!important',
});

globalStyle(`${terminalWrapperClass} [data-selected="true"][role="tab"]`, {
  backgroundColor: 'white',
  color: 'black',
});
