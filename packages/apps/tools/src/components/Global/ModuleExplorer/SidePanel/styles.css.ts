import { style } from '@vanilla-extract/css';

export const containerStyle = style([
  { display: 'flex', flexDirection: 'column', height: '85vh' },
]);

export const modulesContainerStyle = style([{ flex: 1, overflow: 'scroll' }]);
