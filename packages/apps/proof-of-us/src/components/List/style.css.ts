import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const listClass = style({
  listStyle: 'none',
  paddingInline: '0',
  width: '100%',
  overflowY: 'scroll',
  flex: 1,
});

export const listItemClass = style([
  atoms({
    position: 'relative',
    display: 'block',
    width: '100%',
  }),
  {
    minHeight: '50px',
  },
]);
export const titleClass = style([
  atoms({
    fontWeight: 'bodyFont.bold',
  }),
  { flex: 1 },
]);

export const listItemLinkClass = style([
  atoms({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: 'md',
    marginBlock: 'sm',
  }),
  {
    backgroundColor: 'rgba(255,255,255, .04)',
    textDecoration: 'none',
    selectors: {
      '&:hover': {
        opacity: '.8',
      },
    },
  },
]);
