import { customTokens } from '@/styles/tokens.css';
import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const listClass = style({
  listStyle: 'none',
  paddingInline: 0,
});

export const listItemClass = style([
  atoms({
    position: 'relative',
    display: 'block',
    width: '100%',
  }),
  {
    minHeight: '50px',
    borderBottom: '1px solid white',
  },
]);
export const titleClass = style([
  atoms({
    fontWeight: 'bodyFont.bold',
  }),
  { flex: 1 },
]);
export const timeClass = style([
  atoms({
    fontSize: 'xs',
  }),
  { opacity: '.7' },
]);
export const listItemLinkClass = style([
  atoms({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    paddingInline: 'sm',
    paddingBlock: 'md',
  }),
  {
    borderBottom: `1px solid ${customTokens.color.border}`,
    textDecoration: 'none',
    selectors: {
      '&:hover': {
        opacity: '.8',
      },
    },
  },
]);
