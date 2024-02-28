import { atoms, token } from '@kadena/react-ui/styles';
import { createVar, style } from '@vanilla-extract/css';

export type FormFieldStatus = 'disabled' | 'positive' | 'warning' | 'negative';
export const statusColor = createVar();
export const statusOutlineColor = createVar();

export const cardClass = style([
  atoms({
    // display: 'flex',
  }),
  {
    border: '2px solid #FFA500' /* Orange border */,
    borderRadius: '15px' /* Rounded corners */,
    padding: '20px',
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)' /* Card shadow */,
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  },
]);

export const imgClass = style([
  atoms({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 'md',
  }),
  {
    width: '100px',
    height: '100px',
    border: `${token('border.normal')} solid ${token(
      'color.accent.semantic.info',
    )} `,
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
    fontWeight: 'bodyFont.bold',
  }),
]);

export const formField = atoms({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  gap: 'sm',
});
