import { atoms, globalStyle, style } from './../../../../styles';

export const rightAsideClass = style([
  atoms({ display: 'flex', flexDirection: 'column', flex: 1 }),
  {},
]);
export const rightAsideContentClass = style([
  atoms({ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }),
  {},
]);

globalStyle(`${rightAsideClass} > form `, {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  width: '100%',
});
