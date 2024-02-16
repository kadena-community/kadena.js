import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const centerClass = style([
  atoms({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  {
    height: '50vh',
  },
]);
export const emptyListLinkClass = style([
  atoms({
    display: 'flex',
    alignItems: 'center',
    gap: 'sm',
    fontWeight: 'bodyFont.bold',
    fontSize: 'xl',
  }),
]);
