import { atoms, style } from '@kadena/react-ui/styles';

export const borderStyleClass = atoms({
  borderStyle: 'solid',
  borderWidth: 'hairline',
  display: 'flex',
});

export const statisticsSpireKeyClass = atoms({
  borderStyle: 'solid',
  borderWidth: 'hairline',
  display: 'flex',
  backgroundColor: 'base.inverse.default',
});

export const boxClass = style([
  atoms({
    borderWidth: 'hairline',
    borderStyle: 'solid',
    borderColor: 'base.subtle',
    backgroundColor: 'surface.default',
  }),
  {
    maxHeight: '48px',
  },
]);

export const overFlowClass = style({
  whiteSpace: 'nowrap',
});
