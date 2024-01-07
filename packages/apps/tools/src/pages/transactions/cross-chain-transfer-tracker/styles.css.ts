import { atoms, sprinkles } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const formButtonStyle = style([
  sprinkles({
    alignItems: 'center',
    marginY: '$4',
    display: 'flex',
    flexDirection: 'row-reverse',
  }),
]);

export const infoBoxStyle = style([
  sprinkles({
    fontSize: '$base',
    padding: '$2',
    borderRadius: '$sm',
    display: 'flex',
    flexDirection: 'column',
    gap: '$6',
  }),
]);

export const footerBarStyle = style([
  atoms({
    width: '100%',
    position: 'sticky',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  }),
  {
    background: '#FAFAFA70',
    backdropFilter: 'blur(3px)',
  },
]);
