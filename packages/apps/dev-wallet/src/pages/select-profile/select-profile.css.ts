import { atoms, token } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

const borderColor = token('color.accent.brand.secondary');

export const cardClass = style([
  atoms({
    borderRadius: 'md',
    padding: 'md',
    textAlign: 'center',
    fontFamily: 'bodyFont',
  }),
  {
    border: `2px solid ${borderColor}`,
    boxShadow: `0px 4px 8px 0 ${token('color.border.base.default')}`,
  },
]);

export const imgClass = style([
  atoms({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 'xxl',
    marginBlockEnd: 'md',
  }),
  {
    width: '100px',
    height: '100px',
    border: `2px solid ${borderColor}`,
  },
]);
export const aliasClass = style([
  atoms({
    fontSize: 'lg',
    color: 'text.brand.primary.default',
  }),
]);

export const initialsClass = style([
  atoms({
    fontSize: '9xl',
    fontWeight: 'secondaryFont.bold.bold.bold.bold.bold.bold',
  }),
]);

export const formField = atoms({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  gap: 'sm',
});
