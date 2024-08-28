import { atoms, token } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const containerStyle = style([
  atoms({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  { backgroundColor: 'rgba(0, 0, 0, 0.8)', zIndex: token('zIndex.overlay') },
]);
