import { atoms, darkThemeClass, tokens } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const resourceLinksWrapperClass = style([
  atoms({
    marginBlockStart: 'md',
    paddingBlockStart: 'md',
  }),
  {
    borderTop: `1px solid #E3E1E5`,
    selectors: {
      [`${darkThemeClass} &`]: {
        borderBottom: `1px solid #27232999`,
      },
    },
  },
]);

export const titleWrapperClass = style([
  atoms({
    display: 'flex',
  }),
]);

export const titleTextClass = style([
  atoms({
    fontSize: 'sm',
    fontWeight: 'bodyFont.bold',
    marginInlineStart: 'sm',
  }),
]);

export const linksClass = style([
  atoms({
    paddingInlineStart: 'md',
    marginBlockStart: 'sm',
  }),
  {
    color: tokens.kda.foundation.color.palette.blue.n80,
    selectors: {
      [`&.visited`]: {
        color: tokens.kda.foundation.color.palette.blue.n60,
      },
    },
  },
]);

export const linkClass = style([
  atoms({
    textDecoration: 'underline',
    color: 'inherit',
  }),
]);
