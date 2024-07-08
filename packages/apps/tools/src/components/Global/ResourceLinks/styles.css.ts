import { atoms, tokens } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const resourceLinksWrapperClass = style([
  atoms({
    marginBlockStart: 'md',
    padding: 'md',
  }),
  {
    borderTop: `1px solid ${tokens.kda.foundation.color.border.base['@disabled']}`,
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
    fontWeight: 'secondaryFont.bold',
    marginInlineEnd: 'sm',
  }),
]);

export const linksClass = style([
  atoms({
    paddingInlineStart: 'md',
    marginBlockStart: 'sm',
  }),
]);
