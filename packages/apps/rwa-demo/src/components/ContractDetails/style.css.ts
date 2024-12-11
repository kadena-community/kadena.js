import { style } from '@kadena/kode-ui';
import { atoms, token } from '@kadena/kode-ui/styles';

export const contractDetailWrapperClass = style([
  atoms({
    width: '100%',
    flexWrap: 'wrap',
  }),
  {
    rowGap: token('spacing.lg'),
  },
]);
export const contractDetailsClass = style([
  atoms({}),
  {
    flexBasis: '50%',
  },
]);
export const contractDetailsHeaderClass = style([
  atoms({}),
  {
    fontSize: `${token('typography.fontSize.sm')}!important`,
  },
]);
export const contractDetailsBodyClass = style([
  atoms({
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    color: 'text.base.default',
  }),
  {},
]);
