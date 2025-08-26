import { atoms } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const formButtonStyle = style([
  atoms({
    alignItems: 'center',
    marginBlock: 'md',
    display: 'flex',
    flexDirection: 'row-reverse',
  }),
]);

export const infoBoxStyle = style([
  atoms({
    fontSize: 'sm',
    padding: 'md',
    borderRadius: 'sm',
    display: 'flex',
    flexDirection: 'column',
  }),
]);

export const linksBoxStyle = style([
  atoms({
    fontSize: 'base',
    borderRadius: 'sm',
    display: 'flex',
    flexDirection: 'column',
  }),
]);

export const footerBarStyle = style([
  atoms({
    width: '100%',
    display: 'block',
    position: 'sticky',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBlock: 'sm',
    paddingInlineEnd: 'sm',
  }),
  {
    background: '#FAFAFA70',
    backdropFilter: 'blur(3px)',
  },
]);
