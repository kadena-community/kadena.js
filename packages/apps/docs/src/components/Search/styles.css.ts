import { atoms, tokens } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const staticResultsListClass = style([
  atoms({
    padding: 'no',
  }),
  {
    listStyle: 'none',
  },
]);

export const tabContainerClass = style([
  atoms({ flex: 1, overflowY: 'hidden', overflowX: 'visible' }),
]);

export const tabClass = style([
  atoms({
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    overflowY: 'auto',
    overflowX: 'visible',
  }),
]);

export const itemLinkClass = style([
  atoms({
    display: 'block',
    textDecoration: 'none',
    padding: 'sm',
    marginBlockEnd: 'md',
  }),
]);

export const loadingWrapperClass = style([
  atoms({
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  {
    opacity: '.8',
    inset: 0,
  },
]);
