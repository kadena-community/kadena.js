import { style, token } from '../../styles';

export const underlayClass = style([
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    inset: 0,
    // TODO: Update to use token: please check docs search dialog to align
    // backgroundColor: 'rgba(34, 33, 33, 0.8)',
    zIndex: token('zIndex.modal'),
    backdropFilter: 'blur(12px)',
  },
]);
